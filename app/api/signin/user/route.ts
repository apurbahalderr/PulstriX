import ApiResponse from "@/utils/ApiResopnse";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod"
import { dbConnect } from "@/utils/dbConnect";
import { User } from "@/models/user.model";
import jwt from "jsonwebtoken";

const loginSchema = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.coerce.number().refine(val => val.toString().length === 10, { message: "Phone number must be 10 digits" }),
    sessionId: z.string(),
})


export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log(body)
        const parsedBody = loginSchema.safeParse(body);
        if (!parsedBody.success) {
            console.log("Invalid inputs")
            return NextResponse.json(
                new ApiResponse(false, "Invalid input", null, parsedBody.error.message), { status: 400 }
            )
        }

        const { email, phone, name, sessionId } = parsedBody.data;
        await dbConnect();
        let user = await User.findOne({ email });
        let isPhoneUpdated = false;
        let msg = ""

        if (!user) {
            console.log("User not exist, creating new user")
            user = await User.create({
                name, 
                email,
                phone,
                sessionId,
                role: "user"
            })
        } else {
            console.log("User exists")
            if(user.phone !== phone){
                user.phone = phone;
                isPhoneUpdated = true;
                await user.save();
            }
        }

        if(isPhoneUpdated){
            msg = "Sign in successful, phone number updated";
        } else {
            msg = "Sign in successful";
        }

        const payload = {
            _id: user._id,
            sessionId: user.sessionId,
            role: user.role,
            email: user.email
        } as jwt.JwtPayload

        const secret = process.env.JWT_SECRET as string;
        const expiresIn = { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]}  ;

        const token = jwt.sign(payload, secret, expiresIn)

        const response = NextResponse.json(
            new ApiResponse(true, msg, user), {status: 200}
        )
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
        })
        
        return response;


    } catch (error) {
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, (error as Error).message), { status: 500 }
        )
    }
}