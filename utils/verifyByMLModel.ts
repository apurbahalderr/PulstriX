
import { Responder } from "@/models/responder.model";
import { Report } from "@/models/report.model";
import { classifyPriority, checkTextDuplicate, checkImageDuplicate } from "./mlClient";
import { sendNotification } from "./sendNotification";

const departmentMapping: Record<string, string> = {
    "Fire": "Fire Department",
    "Accident": "Traffic Police",
    "Medical": "Health Department",
    "Crime": "Police Department",
    "Disaster": "Disaster Management",
    "Infrastructure Collapse": "Public Works Department",
    "Other": "General",
    "Emergency": "Emergency Response"
};

export default async function verifyByMLModel(
    reportId: string,
    image: string | undefined, 
    severity: string, 
    type: string, 
    location: { lat: number; lng: number }, 
    description: string
) {
    console.log(`Starting ML verification for report ${reportId}`);
    
    let isDuplicate = false;
    let originalReportId: string | null = null;

    try {
        const dedupResult = await checkTextDuplicate(description, location.lat, location.lng);
        if (dedupResult && dedupResult.duplicate) {
            isDuplicate = true;
            console.log(`Report ${reportId} flagged as duplicate by Text ML.`);

            const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
            const potentialOriginals = await Report.find({
                _id: { $ne: reportId },
                createdAt: { $gte: threeHoursAgo },
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [location.lng, location.lat]
                        },
                        $maxDistance: 2000
                    }
                }
            }).sort({ createdAt: -1 }).limit(1);

            if (potentialOriginals.length > 0) {
                originalReportId = potentialOriginals[0]._id as string;
            }
        }
    } catch (err) {
        console.error("Text Dedup check failed", err);
    }

    if (!isDuplicate && image) {
        try {
            const recentReports = await Report.find({
                image: { $exists: true, $ne: null },
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                _id: { $ne: reportId }
            }).limit(20);

            if (recentReports.length > 0) {
                const imageDedupResult = await checkImageDuplicate(image, location.lat, location.lng, recentReports);
                
                if (imageDedupResult && imageDedupResult.image_matches && imageDedupResult.image_matches.length > 0) {
                    isDuplicate = true;
                    console.log(`Report ${reportId} flagged as duplicate by Image ML.`);

                    const bestMatch = imageDedupResult.image_matches.reduce((prev: any, current: any) => 
                        (prev.similarity_score > current.similarity_score) ? prev : current
                    );
                    originalReportId = bestMatch.incident_id;
                }
            }
        } catch (err) {
            console.error("Image Dedup check failed", err);
        }
    }

    if (isDuplicate) {
        await Report.findByIdAndUpdate(reportId, { 
            status: 'resolved', 
            responderNotes: 'Auto-flagged as duplicate by AI system.'
        });

        if (originalReportId) {
            await Report.findByIdAndUpdate(originalReportId, { $inc: { duplicates: 1 } });
        }

        return { verified: false, reason: "Duplicate detected" };
    }

    let verifiedSeverity = severity;
    try {
        const priorityResult = await classifyPriority(reportId, type, description, !!image);
        
        if (priorityResult && priorityResult.priority) {
            verifiedSeverity = priorityResult.priority.toLowerCase();
            console.log(`ML Priority: ${verifiedSeverity} (Conf: ${priorityResult.confidence})`);
            
            await Report.findByIdAndUpdate(reportId, { severity: verifiedSeverity });
        }
    } catch (err) {
        console.error("Priority check failed", err);
        const criticalKeywords = ["fire", "blood", "explosion", "dead", "collapse"];
        if (criticalKeywords.some(word => description.toLowerCase().includes(word))) {
            verifiedSeverity = "high";
        }
    }

    const department = departmentMapping[type];
    
    const nearestResponder = await Responder.findOne({
        department: department,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [location.lng, location.lat]
                }
            }
        }
    });

    const updateData: any = {
        severity: verifiedSeverity,
        type: type,
        status: "assigning"
    };

    if (nearestResponder) {
        updateData.$push = { responderId: nearestResponder._id };
        console.log(`Assigning responder ${nearestResponder.name} to report ${reportId}`);
        
        // Notify Responder
        sendNotification({
            title: "New Incident Assigned",
            message: `A new ${verifiedSeverity} priority ${type} incident has been assigned to you.`,
            url: "/responder/dashboard",
            userId: nearestResponder._id.toString()
        }).catch(err => console.error("Failed to notify responder", err));

    } else {
        console.log(`No responder found for type ${type} near location.`);
    }

    await Report.findByIdAndUpdate(reportId, updateData);

    return {
        verified: true,
        assignedResponder: nearestResponder ? nearestResponder.name : null
    };
}