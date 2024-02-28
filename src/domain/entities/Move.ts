import { Game } from "./Game";
import { Player } from "./Player";

export interface Move {
  id: string;
  choice: number;
  value: number;
  game: Game;
  player: Player;
}
