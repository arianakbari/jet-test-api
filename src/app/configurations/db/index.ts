import { DataSource } from "typeorm";
import "reflect-metadata";
import { Player, Game, Move } from "#src/app/models/index.js";
import { Config } from "#src/app/configurations/config/index.js";

// We have to instantiate settings manually here because we are outside the ioc container
const config = new Config();

const entities = [Player, Game, Move];

export const dataSource = new DataSource({
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  entities: entities,
  // Should be set to false in real production apps and use migrations instead
  synchronize: true,
});
