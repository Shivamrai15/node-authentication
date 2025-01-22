import { Router } from "express";
import { VerifyPasswordSchema } from "../schemas/verify-password.schema";
import { verifyForgetPasswordToken } from "../libs/verification-token";
import bcrypt from "bcryptjs";
import { db } from "../db";


export const verifyPasswordRouter = Router();

verifyPasswordRouter.patch("/verify-password", async(req, res)=>{
    try {
        
        const body = req.body;
        const validatedData = await VerifyPasswordSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return res.json({
                success : false,
                message : "Password is required",
                data : {}
            }).status(400);
        }

        const { password, token } = validatedData.data;

        const userVerified = await verifyForgetPasswordToken(token);

        if (!userVerified) {
            return res.json({
                success : false,
                message : "Forget password link is expired",
                data : {}
            }).status(401);
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await db.user.update({
            where : {
                id : userVerified
            },
            data : {
                password : hashedPassword
            }
        });


        return res.json({
            success : true,
            message : "Password updated",
            data : {}
        }).status(200);


    } catch (error) {
        console.log("VERIFY PASSWORD API ERROR", error);
        return res.json({
            success : false,
            message : "Internal server error",
            data : {}
        }).status(500);
    }
})