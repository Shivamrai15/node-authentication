import { nanoid } from "nanoid";
import { db } from "../db";
import jwt from "jsonwebtoken"

export const generateVerificationToken = async(userId: string)=>{
    try {
        
        const token = nanoid();
        const expiredAt = new Date(Date.now() + 10*60*1000);

        await db.emailVerificationToken.create({
            data : {
                userId,
                expiredAt,
                token
            }
        });

        const jwtToken = jwt.sign(
            {userId, token},
            process.env.EMAIL_VERIFICATION_SECRET!,
            { expiresIn : "10m" }
        );

        return jwtToken;

    } catch (error) {
        console.log("ERROR WHILE GENERATING VERIFICATION TOKEN", error);
        return null;
    }
}