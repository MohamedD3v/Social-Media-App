import express from "express";
import type { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { configDotenv } from "dotenv";
import authRouter from "./Modules/Auth/auth.controller";
import userRouter from "./Modules/User/user.controller";
import { globalError } from "./Utils/Response/err.response";
import connectDB from "./DB/connection";
configDotenv({ path: "./config/.env.dev" });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    status: 429,
    message: "Too Many Entire Wrong , Try Agian Later",
  },
});
export const bootstrap = async () => {
  const app: Express = express();
  const port: number = Number(process.env.PORT) || 5000;

  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(limiter);
  await connectDB();
  app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Test Message" });
  });
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("{/*Will}", (req: Request, res: Response) => {
    return res.status(404).json({ message: "Page Not Found" });
  });
  app.use(globalError);
  app.listen(port, () => {
    console.log(`Server is Running ON http://localhost:${port}`);
  });
};
