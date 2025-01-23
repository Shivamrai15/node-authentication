import { Router } from "express";
import { ForgetPasswordSchema } from "../schemas/forget-passowrd.schema";
import { db } from "../db";
import { generateForgetPasswordToken } from "../libs/verification-token";
import { sendForgetPasswordEmail } from "../libs/email";
import { rateLimitMiddleware } from "../middleware/ratelimit.middleware";

export const forgetPasswordRouter = Router();


forgetPasswordRouter.post("/forget-password", rateLimitMiddleware, async(req, res)=>{
    try {

        const body = req.body;
        const validatedData = await ForgetPasswordSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return res.json({
                success: false,
                message : "Email is required",
                data : {}
            }).status(400);
        }

        const data = validatedData.data

        const user = await db.user.findUnique({
            where : {
                email : data.email
            }
        });

        if (!user) {
            return res.json({
                success: false,
                message : "Account doesn't exist",
                data : {}
            }).status(404);
        }

        const generatedForgetPasswordToken = await generateForgetPasswordToken(user.id);

        if (!generatedForgetPasswordToken) {
            return res.json({
                success : false,
                message : "Internal server error",
                data : {}
            }).status(500);
        }

        await sendForgetPasswordEmail(data.email, generatedForgetPasswordToken);

        return res.json({
            success: true,
            message : "Forget password email has been sent",
            data : {}
        }).status(200);
        
    } catch (error) {
        console.log("FORGET PASSWORD API ERROR", error);
        return res.json({
            success : false,
            message : "Internal server error",
            data : {}
        }).status(500);
    }
})