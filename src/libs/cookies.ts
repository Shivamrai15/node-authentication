import jwt from "jsonwebtoken";


export const generateCookie = (userId: string, email: string) => {
    const jwtToken = jwt.sign(
        {userId, email},
        process.env.COOKIE_VERIFICATION_SECRET!,
        { expiresIn : "30d" }
    );

    return jwtToken;
}