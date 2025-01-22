import * as z from "zod";


export const VerifyPasswordSchema = z.object({
    token : z.string().min(15),
    password : z.string().min(8)
})