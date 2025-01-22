import { Router } from "express";
import { RegisterSchema } from "../schemas/register.schema";
import { db } from "../db";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../libs/verification-token";
import { sendVerificationEmail } from "../libs/email";


export const signUpRouter = Router();


signUpRouter.post("/register", async(req, res)=>{
    try {

        const body = req.body;
        const validateData = await RegisterSchema.safeParseAsync(body);

        if (!validateData.success) {
            return res.json({
                success : false,
                message : "Invalid input fields",
                data : {}
            }).status(400);
        }

        const data = validateData.data;
        const existedUser = await db.user.findUnique({
            where : {
                email : data.email
            }
        });

        if (existedUser) {
            return res.json({
                success : false,
                message : "Account already exist",
                data : {}
            }).status(400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = await db.user.create({
            data : {
                email : data.email,
                name : data.name,
                password : hashedPassword
            },
            select : {
                id: true,
                email: true,
                name : true
            }
        });

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
            data : user
        }).status(201);

        
    } catch (error) {
        console.log("REGISTER API ERROR", error);
        return res.json({
            success : false,
            message : "Internal server error",
            data : {}
        }).status(500);
    }
});
