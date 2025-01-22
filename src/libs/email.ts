import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_SECRET_KEY);

export const sendVerificationEmail = async(email: string, token: string)=>{
    try {

        const verificationUrl = `${process.env.CLIENT}/verify?token=${token}`
        
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Email verification',
            html: `<div>
                <strong>Click here to verify your email</strong>
                <a href="${verificationUrl}" >Link</a>
            </div>`,
          });

    } catch (error) {
        throw new Error("Resend error");
    }
}


export const sendForgetPasswordEmail = async(email: string, token: string)=>{
    try {

        const verificationUrl = `${process.env.CLIENT}/new-password?token=${token}`
        
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Update password',
            html: `<div>
                <strong>Click here to update your passowrd</strong>
                <a href="${verificationUrl}" >Link</a>
            </div>`,
        });

    } catch (error) {
        throw new Error("Resend error");
    }
}