import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/dbConnect';
import { Report } from '@/models/report.model';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { reportId, action, sessionId } = await req.json();

        if (!reportId || !['upvote', 'downvote'].includes(action) || !sessionId) {
            return NextResponse.json(
                { success: false, error: "Invalid request. Missing reportId, action, or sessionId." },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return NextResponse.json(
                { success: false, error: "Invalid report ID" },
                { status: 400 }
            );
        }

        const report = await Report.findById(reportId);
        if (!report) {
            return NextResponse.json(
                { success: false, error: "Report not found" },
                { status: 404 }
            );
        }

        if (report.votedBy && report.votedBy.includes(sessionId)) {
            return NextResponse.json(
                { success: false, error: "You have already voted on this report" },
                { status: 400 }
            );
        }

        const update = action === 'upvote'
            ? { $inc: { upvotes: 1 }, $push: { votedBy: sessionId } }
            : { $inc: { downvotes: 1 }, $push: { votedBy: sessionId } };

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            update,
            { new: true }
        );

        return NextResponse.json({
            success: true,
            data: updatedReport
        });

    } catch (error) {
        console.error("Error processing vote:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process vote" },
            { status: 500 }
        );
    }
}
