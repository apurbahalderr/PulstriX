import { Responder } from "@/models/responder.model";
import { Employee } from "@/models/employee.model";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";
import z from "zod";

const addEmployeesSchema = z.object({
    responderId: z.string(),
    emails: z.array(z.string().email())
});

export async function POST(req: NextRequest) {
    console.log("Adding employees to responder");
    try {
        const body = await req.json();
        const parsedBody = addEmployeesSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                new ApiResponse(false, "Invalid input", null, parsedBody.error.message), { status: 400 }
            );
        }

        const { responderId, emails } = parsedBody.data;
        await dbConnect();

        const responder = await Responder.findById(responderId);
        if (!responder) {
            return NextResponse.json(
                new ApiResponse(false, "Responder not found", null), { status: 404 }
            );
        }

        // Find employees by email
        const employees = await Employee.find({ email: { $in: emails } });
        
        if (employees.length === 0) {
             return NextResponse.json(
                new ApiResponse(false, "No matching employees found for the provided emails", null), { status: 404 }
            );
        }

        const employeeIds = employees.map(emp => emp._id.toString());

        await Responder.findByIdAndUpdate(responderId, {
            $addToSet: { employees: { $each: employeeIds } }
        });

        await Employee.updateMany(
            { _id: { $in: employeeIds } },
            { $set: { responder: responderId } }
        );

        return NextResponse.json(
            new ApiResponse(true, `Successfully added ${employeeIds.length} employees`, {
                addedEmployees: employees.map(e => ({ id: e._id, email: e.email, name: e.name }))
            })
        );

    } catch (error) {
        console.error("Error adding employees:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, (error as Error).message), { status: 500 }
        );
    }
}
