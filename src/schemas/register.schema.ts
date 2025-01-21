import * as z from "zod";

export const RegisterSchema = z.object({
  email : z.string().email(),
  password : z.string().min(8),
  name : z.string().optional() 
});