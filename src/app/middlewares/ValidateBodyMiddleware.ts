import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const ValidateBodyMiddleware = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validateAsync(req.body);
      next();
    } catch (e) {
      return res.status(400).json({
        error: e,
      });
    }
  };
};
