import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEnum, IsInt, IsOptional, IsUUID } from "class-validator";
import { type Player } from "./Player";
import { GAME_STATUS } from "#src/domain/entities/index.js";

@Entity()
export class Game {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID(4)
  id: string;

  @Column("int")
  @IsInt()
  number: number;

  @Column("enum", { enum: GAME_STATUS })
  @IsEnum(GAME_STATUS)
  status: GAME_STATUS;

  @Column("uuid", { nullable: true })
  @IsUUID(4)
  @IsOptional()
  winnerId?: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @OneToMany("Player", (player: Player) => player.activeGame)
  players?: Player[];

  @ManyToOne("Player")
  @JoinColumn({
    name: "winnerId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_game_player_winner",
  })
  winner?: Player;
}
