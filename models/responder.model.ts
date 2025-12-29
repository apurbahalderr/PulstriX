import mongoose, { Document, Schema } from "mongoose";
import { Department } from "@/types";

export interface IResponder extends Document {
    name: string;
    email: string;
    phone: number;
    role: "responder";
    department: Department;
    location: { lat: number, lng: number };
    address: string;
    employees?: string[]
}

const ResponderSchema = new Schema<IResponder>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: Number, required: true},
    role: {type: String, enum: ["responder"], default: "responder"},
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
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    address: {type: String, required: true},
    employees: [{type: String}],
}, {
    timestamps: true
})

ResponderSchema.index({ location: "2dsphere" });

export const Responder = mongoose.models.Responder || mongoose.model<IResponder>("Responder", ResponderSchema)