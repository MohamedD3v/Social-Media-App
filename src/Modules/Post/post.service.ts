import { Request, Response } from "express";

class PostService {
  constructor() {}
  createPost = async (req: Request, res: Response) => {
    return res
      .status(201)
      .json({ message: "Post has been Created Successfully" });
  };
}

export default new PostService();
