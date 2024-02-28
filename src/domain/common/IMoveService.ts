import { Game, Move, Player } from "#src/domain/entities";

export interface IMoveService {
  createRecord(choice: number, value: number, player: Player, game: Game): Promise<Move>;
}
