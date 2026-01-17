import express from "express";
import type { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { configDotenv } from "dotenv";
import authRouter from "./Modules/Auth/auth.controller";
import userRouter from "./Modules/User/user.controller";
import postRouter from "./Modules/Post/post.controller";
import {
  BadRequestException,
  globalError,
} from "./Utils/Response/err.response";
import connectDB from "./DB/connection";
import {
  createGetPresignedUrl,
  deleteFile,
  deleteFiles,
  getFile,
} from "./Utils/Multer/s3.config";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
configDotenv({ path: "./config/.env.dev" });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    status: 429,
    message: "Too Many Entire Wrong , Try Agian Later",
  },
});
const createS3WriteStream = promisify(pipeline);
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
  app.get("/uploads/presign/*path", async (req, res) => {
    const { path } = req.params as unknown as { path: string[] };
    const Key = path.join("/");
    const url = await createGetPresignedUrl({ Key });
    return res.status(200).json({ url });
  });
  app.get("/uploads/*path", async (req, res) => {
    const { path } = req.params as unknown as { path: string[] };
    const { download } = req.query;
    const Key = path.join("/");
    const responseS3 = await getFile({ Key });
    if (!responseS3.Body) throw new BadRequestException("file not found");
    res.setHeader(
      "Content-Type",
      responseS3.ContentType || "application/octet-stream"
    );
    if (download) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${download}"`
      );
    }
    return await createS3WriteStream(
      responseS3.Body as NodeJS.ReadableStream,
      res
    );
  });
  app.get("/delete-file-s3", async (req: Request, res: Response) => {
    const { Key } = req.query as { Key: string };
    const result = await deleteFile({ Key: Key as string });
    return res.status(200).json({ result });
  });
  app.get("/delete-files-s3", async (req: Request, res: Response) => {
    const result = await deleteFiles({
      urls: [""],
    });
    return res.status(200).json({ result });
  });
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/post", postRouter);
  app.use("{/*Will}", (req: Request, res: Response) => {
    return res.status(404).json({ message: "Page Not Found" });
  });
  app.use(globalError);
  app.listen(port, () => {
    console.log(`Server is Running ON http://localhost:${port}`);
  });
};
