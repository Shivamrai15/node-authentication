import { Router } from "express";
import jwt from "jsonwebtoken";
import { rateLimitMiddleware } from "../middleware/ratelimit.middleware";

export const logoutRouter = Router();

logoutRouter.get("/logout", rateLimitMiddleware, async(req, res)=>{
    try {

        const cookies = await req.cookies;
        const authtoken = cookies["auth-token"];
        
        if (!authtoken) {
            return res.json({
                success : false,
                message : "Auth token is required",
                data : {}
            }).status(400);
        }

        const isAuthTokenValid = jwt.verify(authtoken, process.env.COOKIE_VERIFICATION_SECRET!);

        if (!isAuthTokenValid) {
            return res.json({
                success : false,
                message : "Your session is expired",
                data : {}
            }).status(401);
        }


        
        return res.cookie(
            "auth-token",
            "",
            { 
                expires : new Date(),
                httpOnly: true 
            }).json({
            success : true,
            message : "Logged out successfully",
            data : {}
        }).status(200);

    } catch (error) {
        console.log("LOGOUT API ERROR", error);
        return res.json({
            success : false,
            message : "Internal server error",
            data : {}
        }).status(500);
    }

});