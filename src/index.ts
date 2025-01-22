import express from "express";
import { signUpRouter } from "./routes/signup.route";
import { emailVerificationRouter } from "./routes/email-verification.route";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/v1/auth", signUpRouter);
app.use("/v1/auth", emailVerificationRouter);


app.listen(PORT, ()=> {
    console.log("App is running on PORT", PORT);
})