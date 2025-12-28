import jwtDecode from "@/utils/jwtDecode";
import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Employee } from "@/models/employee.model";
import ApiResponse from "@/utils/ApiResopnse";

export async function GET(req: NextRequest){
    try {
        const res = await jwtDecode();
        if(!res.success){
            return NextResponse.json(
                { success: false, message: res.message }, { status: 401 }
            )
        }
        
        const {_id} = res.data as jwt.JwtPayload;
        console.log(_id);

        const employees = await Employee.find({responder: _id, status: "idle"});

        return NextResponse.json(
            new ApiResponse(true, "Idle employees fetched successfully", employees), { status: 200 }
        )
        
    } catch (error) {
        console.error("Error while fetching idle employees")
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error"), { status: 500 }
        )
    }
}