import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export default async function jwtDecode(){
    const token = (await cookies()).get("token")?.value || "";
    if(!token) {
        console.error("JWT token missing");
        return {success: false, message: "JWT token missing"};
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        if(!decoded){
            console.error("Decode failed");
            return {success: false, message: "Decode failed"};
        }
        return {success: true, data: decoded}
    } catch (error) {
        console.error("JWT verification error: ", error);
        return {success: false, message: "JWT verification error"};
    }
}