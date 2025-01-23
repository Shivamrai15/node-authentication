import { Router } from "express";
import { LoginSchema } from "../schemas/login.schema";
import { db } from "../db";
import { generateVerificationToken } from "../libs/verification-token";
import { sendVerificationEmail } from "../libs/email";
import bcrypt from "bcryptjs";
import { generateCookie } from "../libs/cookies";
import { rateLimitMiddleware } from "../middleware/ratelimit.middleware";

export const loginRouter = Router();


loginRouter.post("/login", rateLimitMiddleware, async(req, res)=>{
    try {

        const body = req.body;
        const validatedData = await LoginSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return res.json({
                success : false,
                message : "Email or password is required",
                data : {}
            }).status(400);
        }

        const data = validatedData.data;

        const user = await db.user.findUnique({
            where : {
                email : data.email
            }
        });

        if (!user) {
            return res.json({
                success : false,
                message : "Account doesn't exist",
                data : {}
            }).status(404);
        }

        if (!user.isVerified) {
            const generatedToken = await generateVerificationToken(user.id);
            if (!generatedToken) {
                return res.json({
                    success : false,
                    message : "Internal server error",
                    data : {}
                }).status(500);
            }

            await sendVerificationEmail(user.email, generatedToken);
            
            return res.json({
                success : true,
                message : "Email verification link has been send successfully",
                data : {
                    id : user.id,
                    email : user.email,
                    name : user.name
                }
            }).status(200);
        }


        const isPasswordMatched = await bcrypt.compare(data.password, user.password);
        if (!isPasswordMatched) {
            return res.json({
                success : false,
                message : "Your email or password is incorrect",
                data : {}
            }).status(401);
        }

        const jwtToken = generateCookie(user.id, user.email);
        
        return res.cookie(
            "auth-token",
            jwtToken,
            {
                expires : new Date(Date.now()+30*24*60*60*1000),
                httpOnly : true
            }
        ).json({
            success : true,
            message : "Logged in successfully",
            data : {
                id : user.id,
                email : user.email,
                name : user.name
            }
        }).status(200);

        
    } catch (error) {
        console.log("LOGIN API ERROR", error);
        return res.json({
            success : false,
            message : "Internal server error",
            data : {}
        }).status(500);
    }
});