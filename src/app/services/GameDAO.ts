import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import "reflect-metadata";

import { Game, GAME_STATUS, GameNotFoundException } from "#src/domain/entities/index.js";
import { IGameDAO } from "#src/domain/boundaries/output/index.js";
import { TYPES } from "#src/domain/types.js";

import { Game as GameModel } from "#src/app/models/index.js";

@injectable()
export class GameDAO implements IGameDAO {
  constructor(@inject(TYPES.GameRepository) private readonly repo: Repository<GameModel>) {}
  async createNewGame(initialNumber: number): Promise<Game> {
    const { id, status, number } = await this.repo.save(
      this.repo.create({
        number: initialNumber,
        status: GAME_STATUS.WAITING_FOR_PLAYER,
      }),
    );
    return {
      id,
      status,
      number,
      players: [],
    };
  }

  async findJoinableGame(): Promise<Game> {
    const gameInDB = await this.repo.findOne({
      where: { status: GAME_STATUS.WAITING_FOR_PLAYER },
      relations: ["players"],
    });

    if (!gameInDB) throw new GameNotFoundException("Game not found!");

    return {
      id: gameInDB.id,
      number: gameInDB.number,
      status: gameInDB.status,
      winner: null,
      players: gameInDB.players.map((p) => ({ id: p.id, email: p.email })),
    };
  }

  async setGameStatus(gameId: string, status: GAME_STATUS): Promise<void> {
    const { affected } = await this.repo.update({ id: gameId }, { status });

    if (affected !== 1) throw new GameNotFoundException("Game not found!");
  }

  async finishGame(gameId: string, winnerId: string): Promise<void> {
    const { affected } = await this.repo.update(
      { id: gameId, status: GAME_STATUS.IN_PROGRESS },
      { winnerId, status: GAME_STATUS.FINISHED },
    );

    if (affected !== 1) throw new GameNotFoundException("Game not found!");
  }
}
