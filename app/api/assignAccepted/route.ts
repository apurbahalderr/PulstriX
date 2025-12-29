import { Employee } from "@/models/employee.model";
import { Report } from "@/models/report.model";
import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import { sendNotification } from "@/utils/sendNotification";

export async function POST(req: NextRequest){
    console.log("Assign accepted/rejected");
    const body = await req.json();
    const {action, employeeId, reportId} = body;

    try {
        await dbConnect()
        const report = await Report.findById(reportId);
        
        if(!report){
            return NextResponse.json(
                new ApiResponse(false, "Report not found"), { status: 404 }
            )
        }
        
        if(action === "accepted"){
            
            report.status = "assigned";
            await report.save();
            
            
            await Employee.findByIdAndUpdate(employeeId, {
                status: "busy"
            });
            
            // Notify User (Reporter)
            if (report.userId) {
                sendNotification({
                    title: "Help is on the way!",
                    message: "An employee has accepted your report and is responding.",
                    url: `/report?id=${reportId}`,
                    userId: report.userId
                }).catch(err => console.error("Failed to notify user", err));
            }

            // Notify Responder
            if (report.responderId && report.responderId.length > 0) {
                report.responderId.forEach((respId: string) => {
                    sendNotification({
                        title: "Employee Accepted Task",
                        message: `Employee has accepted the assignment for report ${report.type}.`,
                        url: "/responder/dashboard",
                        userId: respId
                    }).catch(err => console.error("Failed to notify responder", err));
                });
            }

            return NextResponse.json(
                new ApiResponse(true, "Report assignment accepted"), { status: 200 }
            )
        } else if(action === "rejected" || action === "passed"){
            
            await Employee.findByIdAndUpdate(employeeId, {
                reportIdAssigned: undefined,
                status: "idle"
            });
            
            
            const responderId = report.responderId && report.responderId.length > 0 
                ? report.responderId[0] 
                : null;
            
            if (!responderId) {
                return NextResponse.json(
                    new ApiResponse(false, "Responder ID not found in report"), { status: 400 }
                )
            }
            
            
            const employees = await Employee.find({
                department: report.type, 
                responder: responderId, 
                status: "idle", 
                _id: { $ne: employeeId },
                reportIdAssigned: { $exists: false }
            });
            
            if(employees.length === 0){
                
                report.status = "verified";
                await report.save();
                return NextResponse.json(
                    new ApiResponse(false, "No idle employees available for reassignment. Report status reset to verified."), { status: 404 }
                )
            }
    
            
            const newEmployee = employees[0];
            if (!report.employeeId.includes(newEmployee._id.toString())) {
                report.employeeId.push(newEmployee._id.toString());
            }
            report.status = "assigning";
            await report.save();
    
            newEmployee.reportIdAssigned = reportId;
            await newEmployee.save();
    
            return NextResponse.json(
                new ApiResponse(true, "Report reassigned to another employee"), { status: 200 }
            )
        }
    } catch (error) {
        console.error("Something went wrong");
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error"), { status: 500 }
        )
    }

}