import { Repository } from "typeorm";
import { inject, injectable } from "inversify";
import "reflect-metadata";

import { Game, Move, Player } from "#src/domain/entities/index.js";
import { IMoveDAO } from "#src/domain/boundaries/output/index.js";
import { TYPES } from "#src/domain/types.js";

import { Move as MoveModel } from "#src/app/models/index.js";

@injectable()
export class MoveDAO implements IMoveDAO {
  constructor(@inject(TYPES.MoveRepository) private readonly repo: Repository<MoveModel>) {}
  async createRecord(choice: number, value: number, player: Player, game: Game): Promise<Move> {
    const move = await this.repo.save(
      this.repo.create({
        choice,
        value,
        playerId: player.id,
        gameId: game.id,
      }),
    );
    return {
      id: move.id,
      choice: move.choice,
      value: move.value,
      player,
      game,
    };
  }
}
