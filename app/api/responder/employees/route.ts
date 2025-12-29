import { Employee } from "@/models/employee.model";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const responderId = searchParams.get("responderId");

        if (!responderId) {
            return NextResponse.json(
                new ApiResponse(false, "Responder ID is required", null), { status: 400 }
            );
        }

        await dbConnect();

        
        const employees = await Employee.find({ responder: responderId });

        return NextResponse.json(
            new ApiResponse(true, "Employees fetched successfully", employees)
        );

    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, (error as Error).message), { status: 500 }
        );
    }
}
