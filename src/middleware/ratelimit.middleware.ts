import { NextFunction, Request, Response } from "express";
import { ratelimit } from "../libs/ratelimit";

export const rateLimitMiddleware = async(req: Request, res: Response, next:NextFunction)=>{
    try {
        
        const ip = req.ip;
        const proxyIp = req.headers['x-forwarded-for'];
        const userIp = proxyIp ? typeof proxyIp === "string" ? proxyIp : proxyIp[0] : ip

        const { success } = await ratelimit.limit(userIp||"")
        if (!success) {
            return res.json({
                success : false,
                message : "Too many requests, please try again in 60 seconds.",
                data : {}
            }).status(429)
        }
        
        next();

    } catch (error) {
        console.log("RATE LIMIT MIDDLEWARE ERROR", error);
        return res.json({
            success : false,
            message : "Internal server error",
            data : {}
        });
    }
}