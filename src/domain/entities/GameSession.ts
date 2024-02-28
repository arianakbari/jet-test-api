import { Player } from "./Player";
import { GAME_STATUS } from "./Game";

export interface GameSession {
  id: string;
  number: number;
  players: Player[];
  currentTurnPlayerId: string | null;
  status: GAME_STATUS;
}
