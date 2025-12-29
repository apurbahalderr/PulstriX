import { Responder } from "@/models/responder.model";
import { Report } from "@/models/report.model";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";
import { sendNotification } from "@/utils/sendNotification";

const departmentMapping: Record<string, string> = {
    "fire": "Fire Department",
    "roadAccident": "Traffic Police",
    "medical": "Health Department",
    "crime": "Police Department",
    "disaster": "Disaster Management",
    "infrastructureCollapse": "Public Works Department",
    "other": "General"
};

async function getTravelTimes(source: {lat: number, lng: number}, destinations: {lat: number, lng: number}[]) {
    const key = process.env.LOCATIONIQ_API_KEY;
    if (!key) {
        console.warn("LOCATIONIQ_API_KEY not found");
        return null;
    }

    const srcStr = `${source.lng},${source.lat}`;
    const destStrs = destinations.map(d => `${d.lng},${d.lat}`).join(';');
    const allCoords = `${srcStr};${destStrs}`;
    
    const destIndices = destinations.map((_, i) => i + 1).join(';');
    
    const url = `https://us1.locationiq.com/v1/matrix/driving/${allCoords}?sources=0&destinations=${destIndices}&key=${key}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.code) {
             console.error("LocationIQ API Error:", data.message);
             return null;
        }
       
        return data.durations?.[0];
    } catch (e) {
        console.error("LocationIQ fetch error:", e);
        return null;
    }
}

export async function POST(req: NextRequest) {
    console.log("Forward Report to Another Responder");
    try {
        const body = await req.json();
        const { reportId, responderId } = body; // responderId is the current responder who is forwarding

        if (!reportId) {
            return NextResponse.json(new ApiResponse(false, "Report ID is required", null), { status: 400 });
        }

        await dbConnect();

        const report = await Report.findById(reportId);
        if (!report) {
            return NextResponse.json(new ApiResponse(false, "Report not found", null), { status: 404 });
        }

        const department = departmentMapping[report.type] || report.type;

        const nearbyResponders = await Responder.find({
            department: department,
            _id: { $ne: responderId }, 
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [report.location.lng, report.location.lat]
                    }
                }
            }
        }).limit(5);

        if (nearbyResponders.length === 0) {
            return NextResponse.json(new ApiResponse(false, "No other responders found nearby", null), { status: 404 });
        }

        let bestResponder = nearbyResponders[0];

        
        
        const destinations = nearbyResponders.map(r => ({
            lat: r.location.lat,
            lng: r.location.lng
        }));

        const travelTimes = await getTravelTimes(report.location, destinations);

        if (travelTimes && travelTimes.length === nearbyResponders.length) {
            
            let minTime = Infinity;
            let minIndex = 0;
            
            travelTimes.forEach((time: number, index: number) => {
                if (time < minTime) {
                    minTime = time;
                    minIndex = index;
                }
            });
            
            bestResponder = nearbyResponders[minIndex];
            console.log(`Selected responder ${bestResponder.name} with travel time ${minTime}s`);
        } else {
            console.log("Using straight-line distance fallback");
        }

        
        const updatedReport = await Report.findByIdAndUpdate(reportId, {
            $push: { responderId: bestResponder._id },
            $set: { status: "assigning" } 
        }, { new: true });

        // Notify the new responder
        sendNotification({
            title: "Forwarded Incident Received",
            message: `A ${report.severity} priority ${report.type} incident has been forwarded to you.`,
            url: "/responder/dashboard",
            userId: bestResponder._id.toString()
        }).catch(err => console.error("Failed to notify new responder", err));

        return NextResponse.json(new ApiResponse(true, "Report forwarded successfully", {
            responder: bestResponder,
            report: updatedReport
        }));

    } catch (error: any) {
        console.error("Error forwarding report:", error);
        return NextResponse.json(new ApiResponse(false, "Internal Server Error", null, error.message), { status: 500 });
    }
}