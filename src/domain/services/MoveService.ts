import { inject, injectable } from "inversify";
import "reflect-metadata";

import { Game, Move, Player } from "#src/domain/entities/index.js";
import { type IMoveDAO } from "#src/domain/boundaries/output";
import { IMoveService } from "#src/domain/common";
import { TYPES } from "#src/domain/types.js";

@injectable()
export class MoveService implements IMoveService {
  constructor(@inject(TYPES.MoveDAO) private readonly moveDAO: IMoveDAO) {}
  createRecord(choice: number, value: number, player: Player, game: Game): Promise<Move> {
    return this.moveDAO.createRecord(choice, value, player, game);
  }
}
