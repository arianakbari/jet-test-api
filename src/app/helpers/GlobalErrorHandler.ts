import { Request, Response } from "express";
import {
  PlayerNotFoundException,
  GameNotFoundException,
  EntityNotFoundInCacheException,
  ForbiddenException,
} from "#src/domain/entities/index.js";

export const GlobalErrorHandler = (error: Error, req: Request, res: Response): Response => {
  if (error instanceof PlayerNotFoundException) {
    return res.status(404).json({
      message: error.message,
    });
  }
  if (error instanceof GameNotFoundException) {
    return res.status(404).json({
      message: error.message,
    });
  }

  if (error instanceof EntityNotFoundInCacheException) {
    return res.status(404).json({
      message: error.message,
    });
  }

  if (error instanceof ForbiddenException) {
    return res.status(401).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: error.message,
  });
};
