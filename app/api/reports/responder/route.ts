import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import { Report } from "@/models/report.model";
import jwtDecode from "@/utils/jwtDecode";
import jwt from "jsonwebtoken";
import { Responder } from "@/models/responder.model";

export async function GET(req: NextRequest) {
    try {
        const res = await jwtDecode();
        if (!res.success) {
            return NextResponse.json(
                new ApiResponse(false, res.message || "Unauthorized"), { status: 401 }
            );
        }

        const { _id } = res.data as jwt.JwtPayload;
        await dbConnect();

        
        const responder = await Responder.findById(_id);
        if (!responder) {
            return NextResponse.json(
                new ApiResponse(false, "Responder not found"), { status: 404 }
            );
        }

        
        const { searchParams } = new URL(req.url);
        const typeFilter = searchParams.get('type');

        // Query to find reports where the LAST element of responderId array matches the current responder's ID
        // We use $arrayElemAt with -1 to get the last element of the array
        let query: any = {
            $expr: { 
                $eq: [ 
                    { $arrayElemAt: [ "$responderId", -1 ] }, 
                    _id 
                ] 
            }
        };

        // Optional type filtering
        if (typeFilter && typeFilter !== 'all') {
            query.type = typeFilter;
        }

        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(
            new ApiResponse(true, "Reports fetched successfully", reports), { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json(
            new ApiResponse(false, "Server error while fetching reports", null, (error as Error).message), { status: 500 }
        );
    }
}

