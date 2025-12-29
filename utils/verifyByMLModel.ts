
import { Responder } from "@/models/responder.model";
import { Report } from "@/models/report.model";
import { classifyPriority } from "./mlClient";

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
    // 1. Call ML Model
    let verifiedSeverity = severity;
    
    const priorityResult = await classifyPriority(reportId, type, description, !!image);
    
    if (priorityResult && priorityResult.priority) {
        // Map ML output (HIGH, MEDIUM, LOW) to our lowercase format
        verifiedSeverity = priorityResult.priority.toLowerCase();
        console.log(`ML Priority Classification: ${verifiedSeverity} (Confidence: ${priorityResult.confidence})`);
        
        // Update the report with the verified severity
        try {
            await Report.findByIdAndUpdate(reportId, { severity: verifiedSeverity });
        } catch (err) {
            console.error("Failed to update report severity", err);
        }
    } else {
        // Fallback to keyword matching if ML fails
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
        type: verifiedType,
        status: "assigning"
    };

    if (nearestResponder) {
        updateData.$push = { responderId: nearestResponder._id };
    }

    await Report.findByIdAndUpdate(reportId, updateData);

    return {
        verified: true,
        assignedResponder: nearestResponder ? nearestResponder.name : null
    };
 }