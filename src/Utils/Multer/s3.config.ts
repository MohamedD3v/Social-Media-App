import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { StorageEnum } from "./cloud.multer";
import { v4 as uuid } from "uuid";
import { createReadStream } from "node:fs";
import { BadRequestException } from "../Response/err.response";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { de } from "zod/v4/locales";
export const s3Config = () => {
  return new S3Client({
    region: process.env.REGION as string,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID as string,
      secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
  });
};

export const uploadFile = async ({
  storageApproch = StorageEnum.memory,
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  file,
}: {
  storageApproch?: StorageEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  file: Express.Multer.File;
}) => {
  const command = new PutObjectCommand({
    Bucket,
    ACL,
    Key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}-${
      file.originalname
    }`,
    Body:
      storageApproch === StorageEnum.memory
        ? file.buffer
        : createReadStream(file.path),
    ContentType: file.mimetype,
  });
  await s3Config().send(command);
  if (!command?.input?.Key)
    throw new BadRequestException("failed to upload file");
  return command.input.Key;
};

export const uploadLargeFile = async ({
  storageApproch = StorageEnum.memory,
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  file,
}: {
  storageApproch?: StorageEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  file: Express.Multer.File;
}) => {
  const upload = new Upload({
    client: s3Config(),
    params: {
      Bucket,
      ACL,
      Key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}-${
        file.originalname
      }`,
      Body:
        storageApproch === StorageEnum.memory
          ? file.buffer
          : createReadStream(file.path),
      ContentType: file.mimetype,
    },
    partSize: 500 * 1024 * 1024,
  });
  upload.on("httpUploadProgress", (progress) => {
    console.log("upload Progress", progress);
  });
  const { Key } = await upload.done();
  if (!Key) throw new BadRequestException("fail to upload file");
  return Key;
};

export const uploadFiles = async ({
  storageApproch = StorageEnum.memory,
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  files,
}: {
  storageApproch?: StorageEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  files: Express.Multer.File[];
}) => {
  let urls: string[] = [];
  urls = await Promise.all(
    files.map((file) => {
      return uploadFile({
        storageApproch,
        Bucket,
        ACL,
        path,
        file,
      });
    })
  );

  return urls;
};

export const createPresignedUrl = async ({
  Bucket = process.env.BUCKET_NAME as string,
  path = "general",
  ContentType,
  originalname,
  expiresIn = 180,
}: {
  Bucket?: string;
  path?: string;
  ContentType?: string;
  originalname?: string;
  expiresIn?: number;
}) => {
  const command = new PutObjectCommand({
    Bucket,
    Key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}--${originalname}`,
  });
  const url = await getSignedUrl(s3Config(), command, {
    expiresIn,
  });
  if (!url || !command?.input.Key) {
    throw new BadRequestException("fail to generate url");
  }
  return { url, Key: command.input.Key };
};

export const getFile = async ({
  Bucket = process.env.BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key: string;
}) => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
  });
  return await s3Config().send(command);
};

export const createGetPresignedUrl = async ({
  Bucket = process.env.BUCKET_NAME as string,
  Key,
  expiresIn = 180,
  donwload = "anything",
}: {
  Bucket?: string;
  Key: string;
  expiresIn?: number;
  donwload?: string;
}) => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentDisposition: `attachment; filename="${donwload}"`,
  });
  const url = await getSignedUrl(s3Config(), command, {
    expiresIn,
  });
  if (!url) {
    throw new BadRequestException("fail to generate url");
  }
  return url;
};

export const deleteFile = async ({
  Bucket = process.env.BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key: string;
}): Promise<DeleteObjectCommandOutput> => {
  const command = new DeleteObjectCommand({
    Bucket,
    Key,
  });
  return await s3Config().send(command);
};

export const deleteFiles = async ({
  Bucket = process.env.BUCKET_NAME as string,
  urls,
  Quiet = false,
}: {
  Bucket?: string;
  urls: string[];
  Quiet?: boolean;
}): Promise<DeleteObjectCommandOutput> => {
  const Objects = urls.map((url) => {
    return { Key: url };
  });
  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: { Objects, Quiet },
  });
  return await s3Config().send(command);
};
