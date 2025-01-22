import { nanoid } from "nanoid";
import { db } from "../db";
import jwt from "jsonwebtoken";

export const generateVerificationToken = async(userId: string)=>{
    try {
        
        const token = nanoid();
        const expiredAt = new Date(Date.now() + 10*60*1000);

        const existedToken = await db.emailVerificationToken.findUnique({
            where : {
                userId
            }
        });

        if (existedToken) {
            await db.emailVerificationToken.delete({
                where : {
                    id : existedToken.id
                }
            });
        }

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


export const verifyVerificationToken = async(jwtToken: string)=>{
    try {

        const data = jwt.verify(jwtToken, process.env.EMAIL_VERIFICATION_SECRET!);
        if (!data) {
            return false;
        }

        // @ts-ignore
        const {userId, token} : { userId: string, token: string } = data;

        const existedToken = await db.emailVerificationToken.findUnique({
            where : {
                userId,
                token
            }
        });

        if (!existedToken) {
            return false
        };

        const currentTime = new Date();
        const expiredAt = new Date(existedToken.expiredAt);

        if ( currentTime > expiredAt ) {
            return false;
        }

        await db.emailVerificationToken.delete({
            where : {
                id : existedToken.id
            }
        });

        return userId;
        
    } catch (error) {
        return false;
    }   
}



export const generateForgetPasswordToken = async(userId: string)=>{
    try {
        
        const token = nanoid();
        const expiredAt = new Date(Date.now() + 10*60*1000);

        const existedToken = await db.forgetPasswordVerificationToken.findUnique({
            where : {
                userId
            }
        });

        if (existedToken) {
            await db.forgetPasswordVerificationToken.delete({
                where : {
                    id : existedToken.id
                }
            });
        }

        await db.forgetPasswordVerificationToken.create({
            data : {
                userId,
                expiredAt,
                token
            }
        });

        const jwtToken = jwt.sign(
            {userId, token},
            process.env.FORGET_PASSWORD_SECRET!,
            { expiresIn : "10m" }
        );

        return jwtToken;

    } catch (error) {
        console.log("ERROR WHILE GENERATING VERIFICATION TOKEN", error);
        return null;
    }
}



export const verifyForgetPasswordToken = async(jwtToken: string)=>{
    try {

        const data = jwt.verify(jwtToken, process.env.FORGET_PASSWORD_SECRET!);
        if (!data) {
            return false;
        }

        // @ts-ignore
        const {userId, token} : { userId: string, token: string } = data;

        const existedToken = await db.forgetPasswordVerificationToken.findUnique({
            where : {
                userId,
                token
            }
        });

        if (!existedToken) {
            return false
        };

        const currentTime = new Date();
        const expiredAt = new Date(existedToken.expiredAt);

        if ( currentTime > expiredAt ) {
            return false;
        }

        await db.forgetPasswordVerificationToken.delete({
            where : {
                id : existedToken.id
            }
        });

        return userId;
        
    } catch (error) {
        return false;
    }   
}