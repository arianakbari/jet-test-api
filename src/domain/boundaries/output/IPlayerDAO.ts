import { Player } from "#src/domain/entities";

export interface IPlayerDAO {
  findByEmail(email: string): Promise<Player>;
  create(email: string): Promise<Player>;
  getInProgressGameId(id: string): Promise<string>;
  setInProgressGameId(id: string, gameId: string): Promise<void>;
  resetActiveGame(playerIds: string[], gameId: string): Promise<void>;
}
