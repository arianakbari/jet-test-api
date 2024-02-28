import { In, IsNull, Not, Repository } from "typeorm";
import { inject, injectable } from "inversify";
import "reflect-metadata";

import { TYPES } from "#src/domain/types.js";
import { IPlayerDAO } from "#src/domain/boundaries/output/index.js";
import { Player, PlayerNotFoundException } from "#src/domain/entities/index.js";
import { Player as PlayerModel } from "#src/app/models/index.js";

@injectable()
export class PlayerDAO implements IPlayerDAO {
  constructor(@inject(TYPES.PlayerRepository) private readonly repo: Repository<PlayerModel>) {}
  async create(email: string): Promise<Player> {
    const { id } = await this.repo.save(this.repo.create({ email }));
    return {
      id,
      email,
    };
  }

  async findByEmail(email: string): Promise<Player> {
    const playerInDb = await this.repo.findOne({
      where: {
        email,
      },
    });
    if (!playerInDb) throw new PlayerNotFoundException("Player not found!");

    return {
      id: playerInDb.id,
      email: playerInDb.email,
    };
  }

  async getInProgressGameId(id: string): Promise<string> {
    const player = await this.repo.findOne({ where: { id, activeGameId: Not(IsNull()) } });

    return player?.activeGameId || null;
  }

  async setInProgressGameId(id: string, gameId: string): Promise<void> {
    const { affected } = await this.repo.update({ id }, { activeGameId: gameId });

    if (affected !== 1) throw new PlayerNotFoundException("Player not found!");
  }

  async resetActiveGame(playerIds: string[], gameId: string): Promise<void> {
    const { affected } = await this.repo.update({ activeGameId: gameId, id: In(playerIds) }, { activeGameId: null });

    if (affected !== playerIds.length) throw new PlayerNotFoundException("Player not found!");
  }
}
