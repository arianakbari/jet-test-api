import { inject, injectable } from "inversify";
import "reflect-metadata";

import { Player, PlayerNotFoundException } from "#src/domain/entities/index.js";
import { type IPlayerDAO } from "#src/domain/boundaries/output";
import { IPlayerService } from "#src/domain/common";
import { TYPES } from "#src/domain/types.js";

@injectable()
export class PlayerService implements IPlayerService {
  constructor(@inject(TYPES.PlayerDAO) private readonly playerDAO: IPlayerDAO) {}
  async findOrCreate(email: string): Promise<Player> {
    let player: Player;
    try {
      player = await this.playerDAO.findByEmail(email);
      return player;
    } catch (e) {
      if (e instanceof PlayerNotFoundException) {
        return this.playerDAO.create(email);
      }
      throw e;
    }
  }

  async getInProgressGameId(id: string): Promise<string> {
    return this.playerDAO.getInProgressGameId(id);
  }

  setInProgressGameId(id: string, gameId: string): Promise<void> {
    return this.playerDAO.setInProgressGameId(id, gameId);
  }

  resetActiveGame(playerIds: string[], gameId: string): Promise<void> {
    return this.playerDAO.resetActiveGame(playerIds, gameId);
  }
}
