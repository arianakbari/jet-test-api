import { Game, Move, Player } from "#src/domain/entities";

export interface IMoveDAO {
  createRecord(choice: number, value: number, player: Player, game: Game): Promise<Move>;
}
