import { Request, Response } from "express";

export const NotFoundErrorHandler = (req: Request, res: Response): Response => {
  return res.sendStatus(404);
};
