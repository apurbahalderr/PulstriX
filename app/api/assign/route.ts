import { Employee } from "@/models/employee.model";
import { Report } from "@/models/report.model";
import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod"
import { sendNotification } from "@/utils/sendNotification";

const assignSchema = z.object({
    responderId: z.string(),
    employeeId: z.string(),
    reportId: z.string(),
})

export async function POST(req: NextRequest) {
    console.log("Assigned");
    const body = await req.json();
    
    
    
    
    
    
    const parsedBody = assignSchema.safeParse(body);
    if (!parsedBody.success) {
        console.log("Invalid inputs for assignment")
        return NextResponse.json(
            new ApiResponse(false, "Invalid input", null, parsedBody.error.message), { status: 400 }
        )
    }

    const { responderId, employeeId, reportId } = parsedBody.data;
    try {
        await dbConnect();
        const employeeAssigned = await Employee.findByIdAndUpdate(employeeId, {
            reportIdAssigned: reportId,
            status: "busy"
        })

        if (employeeAssigned) {
            const report = await Report.findByIdAndUpdate(reportId, {
                $push: { employeeId: employeeId },
                $set: {
                    status: "assigning",
                    responderId: [responderId]
                }
            })

            if (!report) {
                return NextResponse.json(
                    new ApiResponse(false, "Report not found"), { status: 404 }
                )
            }

            // Notify Employee
            sendNotification({
                title: "New Task Assigned",
                message: "You have been assigned a new incident report. Please check your dashboard.",
                url: "/employee",
                userId: employeeId
            }).catch(err => console.error("Failed to notify employee", err));

            return NextResponse.json(
                new ApiResponse(true, "Employee assigned successfully"), { status: 200 }
            )

        }
        return NextResponse.json(
            new ApiResponse(false, "Employee not found"), { status: 404 }
        )


    } catch (error) {
        console.error("Error during assignment:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error"), { status: 500 }
        )
    }

}







