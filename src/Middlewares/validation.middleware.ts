import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../Utils/Response/err.response";
import { ZodError, ZodType } from "zod";
import { z } from "zod";
type KeyReqType = keyof Request;

type SchemaType = Partial<Record<KeyReqType, ZodType>>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction): NextFunction => {
    const validationErrors: Array<{
      key: KeyReqType;
      issues: Array<{ message: string; path: (string | number | symbol)[] }>;
    }> = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      if (!schema[key]) continue;
      const validationResult = schema[key].safeParse(req[key]);

      if (validationResult.error) {
        const errors = validationResult.error as ZodError;

        validationErrors.push({
          key,
          issues: errors.issues.map((issue) => {
            return { message: issue.message, path: issue.path };
          }),
        });
      }
      if (validationErrors.length > 0) {
        throw new BadRequestException("Validation Error", {
          cause: validationErrors,
        });
      }
    }

    return next() as unknown as NextFunction;
  };
};

export const generalFields = {
  username: z.string().min(6).max(20),
  email: z.email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  phone: z.string(),
  gender: z.string(),
  age: z
    .int()
    .min(18, { message: "Your age under 18" })
    .max(80)
    .optional(),
};
