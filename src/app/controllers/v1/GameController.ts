import { type Request } from "express";
import { controller, httpPost, request, requestBody } from "inversify-express-utils";
import { inject } from "inversify";
import "reflect-metadata";

import { type IGameService } from "#src/domain/boundaries/input";
import { TYPES } from "#src/domain/types.js";

import { ValidateBodyMiddleware } from "#src/app/middlewares/index.js";
import { joinGameValidator, makeMoveValidator, subscribeValidator } from "#src/app/validators/index.js";

@controller("/v1/game")
export class GameController {
  constructor(@inject(TYPES.GameService) private readonly gameService: IGameService) {}
  @httpPost("/join", ValidateBodyMiddleware(joinGameValidator))
  async joinGame(@requestBody() data: { email: string }) {
    return this.gameService.joinGame(data.email);
  }

  @httpPost("/make-move", TYPES.ExtractUserMiddleware, ValidateBodyMiddleware(makeMoveValidator))
  async makeMove(@requestBody() data: { gameId: string; choice: number }, @request() req: Request) {
    return this.gameService.makeMove(data.gameId, (req as any).user, data.choice);
  }

  @httpPost("/subscribe", TYPES.ExtractUserMiddleware, ValidateBodyMiddleware(subscribeValidator))
  async subscribe(@requestBody() data: { socketId: string }, @request() req: Request) {
    return this.gameService.subscribe((req as any).user, data.socketId);
  }
}
