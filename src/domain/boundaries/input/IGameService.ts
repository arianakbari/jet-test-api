import { GameSession, Player } from "#src/domain/entities";

export type GameResponse = { game: GameSession; token: string };
export interface IGameService {
  joinGame(email: string): Promise<GameResponse>;
  makeMove(gameId: string, player: Player, choice: number): Promise<GameSession>;
  subscribe(
    player: Player,
    socketId: string,
  ): Promise<{ auth: string; channel_data?: string; shared_secret?: string; channelId: string }>;
}
