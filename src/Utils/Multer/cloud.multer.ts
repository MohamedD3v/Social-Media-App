import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import os from "node:os";
import { v4 as uuid } from "uuid";
import { BadRequestException } from "../Response/err.response";
export enum StorageEnum {
  memory = "memory",
  disk = "disk",
}
export const fileValidation = {
  images: ["image/png", "image/jpeg", "image/jpg"],
};
export const cloudFileUpload = ({
  validation = [],
  storageApproch = StorageEnum.memory,
  maxSizeMB = 2,
}: {
  validation?: string[];
  storageApproch?: StorageEnum;
  maxSizeMB?: number;
}) => {
  const storage =
    storageApproch === StorageEnum.memory
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: os.tmpdir(),
          filename: (req: Request, file: Express.Multer.File, cb) => {
            cb(null, `${uuid()}-${file.originalname}`);
          },
        });
  function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    if (!validation.includes(file.mimetype)) {
      return cb(new BadRequestException("in-valid file type"));
    }
    return cb(null, true);
  }
  return multer({
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    storage,
  });
};
