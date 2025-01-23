import express from "express";
import { signUpRouter } from "./routes/signup.route";
import { emailVerificationRouter } from "./routes/email-verification.route";
import cookieParser from "cookie-parser";
import { loginRouter } from "./routes/login.route";
import { forgetPasswordRouter } from "./routes/forget-password.route";
import { verifyPasswordRouter } from "./routes/verify-password.route";
import { logoutRouter } from "./routes/logout.route";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/v1/auth", signUpRouter);
app.use("/v1/auth", emailVerificationRouter);
app.use("/v1/auth", loginRouter);
app.use("/v1/auth", forgetPasswordRouter);
app.use("/v1/auth", verifyPasswordRouter);
app.use("/v1/auth", logoutRouter);


app.listen(PORT, ()=> {
    console.log("App is running on PORT", PORT);
})