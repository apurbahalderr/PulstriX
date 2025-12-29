import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";
import { sendNotification } from "@/utils/sendNotification";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, message, url, userId, role } = body;

        const result = await sendNotification({ title, message, url, userId, role });

        if (result.success) {
            return NextResponse.json(
                new ApiResponse(true, `Sent notifications`, result)
            );
        } else {
             return NextResponse.json(
                new ApiResponse(false, "Failed to send notifications", null, result.error), { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Error sending notifications:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, error.message), { status: 500 }
        );
    }
}