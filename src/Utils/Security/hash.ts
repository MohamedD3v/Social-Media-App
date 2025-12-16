import { hash, compare } from "bcrypt";

export const generateHash = async (
  plaintext: string,
  saltRound: number = Number(process.env.SALT_ROUND)
): Promise<string> => {
  return await hash(plaintext, saltRound);
};


export const compareHash = async(plaintext:string , hashValue:string):Promise<boolean>=>{
    return await compare(plaintext,hashValue)
}