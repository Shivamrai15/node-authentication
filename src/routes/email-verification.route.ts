import { Router } from "express";
import { EmailVerificationSchema } from "../schemas/email-verification.schema";
import { verifyVerificationToken } from "../libs/verification-token";
import { db } from "../db";

export const emailVerificationRouter = Router();


emailVerificationRouter.patch("/verify-email", async(req, res)=>{
    try {
        
        const body = req.body;
        const vallidateData = await EmailVerificationSchema.safeParseAsync(body);

        if (!vallidateData.success) {
            return res.json({
                success: false,
                message : "Verification token is required",
                data : {}
            }).status(400);
        }

        const token = vallidateData.data.token;
        const isUserVerified = await verifyVerificationToken(token)

        if (!isUserVerified) {
            return res.json({
                success : false,
                message : "Email verification url has been expired",
                data : {}
            }).status(401);
        }

        await db.user.update({
            where : {
                id : isUserVerified
            },
            data : {
                isVerified : true
            }
        });


        return res.json({
            success: true,
            message : "Email has been verified successfully",
            data : {}
        });


    } catch (error) {
        console.log("EMAIL VERIFICATION API ERROR", error);
        return res.json({
            success : false,
            message : "Internal server error",
            data : {}
        }).status(500);
    }
})