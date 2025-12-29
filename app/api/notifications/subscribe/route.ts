import { Subscription } from "@/models/subscription.model";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { subscription, userId, role } = body;
        
        await dbConnect();

        await Subscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            { 
                endpoint: subscription.endpoint,
                keys: subscription.keys,
                userId: userId,
                role: role
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(
            new ApiResponse(true, "Subscription saved successfully", null), { status: 201 }
        );

    } catch (error: any) {
        console.error("Error saving subscription:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, error.message), { status: 500 }
        );
    }
}
