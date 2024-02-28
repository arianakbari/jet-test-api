import { Game, GAME_STATUS } from "#src/domain/entities";

export interface IGameDAO {
  findJoinableGame(): Promise<Game>;
  createNewGame(initialNumber: number): Promise<Game>;
  setGameStatus(gameId: string, status: GAME_STATUS): Promise<void>;
  finishGame(gameId: string, winnerId: string): Promise<void>;
}
