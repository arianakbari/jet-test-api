import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, IsOptional, IsUUID, IsVariableWidth } from "class-validator";
import { type Game } from "./Game";

@Entity()
export class Player {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID(4)
  id: string;

  @Column("varchar", { unique: true })
  @IsVariableWidth()
  @IsEmail()
  email: string;

  @Column("uuid", { nullable: true })
  @IsUUID(4)
  @IsOptional()
  activeGameId?: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @ManyToOne("Game", (game: Game) => game.players)
  @JoinColumn({
    name: "activeGameId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_game_player",
  })
  activeGame?: Game;
}
