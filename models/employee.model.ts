import mongoose, { Document, Schema } from "mongoose";
import { Department } from "@/types";

export interface IEmployee extends Document {
    name: string;
    email: string;
    phone: number;
    role: "employee";
    responder?: string;
    department: Department;
    reportIdAssigned?: string;
    status: "idle" | "busy";
    location?: { lat: number, lng: number };
}

const EmployeeSchema = new Schema<IEmployee>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    role: { type: String, enum: ["employee"], default: "employee" },
    responder: { type: String },
    department: { 
        type: String, 
        required: true,
        enum: [
            "Fire Department",
            "Traffic Police",
            "Health Department",
            "Police Department",
            "Disaster Management",
            "Public Works Department",
            "General",
            "Emergency Response"
        ]
    },
    reportIdAssigned: { type: String },
    status: { type: String, enum: ["idle", "busy"], default: "idle" },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, {
    timestamps: true
})

export const Employee = mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema)