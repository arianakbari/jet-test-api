import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import "reflect-metadata";

import { type ITokenService } from "#src/domain/boundaries/output";
import { Player } from "#src/domain/entities";
import { TYPES } from "#src/domain/types.js";

@injectable()
export class ExtractUserMiddleware extends BaseMiddleware {
  @inject(TYPES.TokenService) private readonly tokenService: ITokenService;
  public async handler(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    try {
      (req as any).user = await this.tokenService.verify<Player>(token);
      next();
    } catch (e) {
      return res.sendStatus(401);
    }
  }
}
