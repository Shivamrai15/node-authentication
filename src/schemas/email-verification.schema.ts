import * as z from "zod";

export const EmailVerificationSchema = z.object({
    token : z.string().min(15)
});