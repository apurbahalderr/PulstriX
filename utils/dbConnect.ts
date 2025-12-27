import mongoose from "mongoose"

type isConnectedObjType = {
    isConnected?: number;
}

const isConnectedObj: isConnectedObjType = {};

export async function dbConnect() {
    if (isConnectedObj.isConnected) {
        console.log("Connection exist");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        if (!db.connections[0].readyState) { throw new Error("DB connection failed") }
        isConnectedObj.isConnected = db.connections[0].readyState;
        console.log("DB connection successful")
    } catch (error) {
        console.log("DB connection failure", (error as Error).message)
    }
}