import { Player } from "#src/domain/entities";

export interface IPlayerService {
  findOrCreate(email: string): Promise<Player>;
  getInProgressGameId(id: string): Promise<string>;
  setInProgressGameId(id: string, gameId: string): Promise<void>;
  resetActiveGame(playerIds: string[], gameId: string): Promise<void>;
}
