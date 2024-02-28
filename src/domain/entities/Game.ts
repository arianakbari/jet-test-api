import { Player } from "./Player";

export enum GAME_STATUS {
  WAITING_FOR_PLAYER = "WAITING_FOR_PLAYER",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export interface Game {
  id: string;
  number: number;
  status: GAME_STATUS;
  players: Player[];
  winner?: Player;
}
