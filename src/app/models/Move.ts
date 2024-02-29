import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsInt, IsUUID } from "class-validator";
import { type Player } from "./Player";
import { type Game } from "./Game";

@Entity()
export class Move {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID(4)
  id: string;

  @Column("int")
  @IsInt()
  choice: number;

  @Column("int")
  @IsInt()
  value: number;

  @Column("uuid")
  @IsUUID(4)
  playerId: string;

  @Column("uuid")
  @IsUUID(4)
  gameId: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @ManyToOne("Player")
  @JoinColumn({
    name: "playerId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_move_player",
  })
  player: Player;

  @ManyToOne("Game")
  @JoinColumn({
    name: "gameId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_game_move",
  })
  game: Game;
}
