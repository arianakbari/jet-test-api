import { injectable } from "inversify";
import "reflect-metadata";

import { IConfig } from "#src/domain/boundaries/output";

@injectable()
export class Config implements IConfig {
  dbHost: string;
  dbName: string;
  dbPassword: string;
  dbPort: number;
  dbUser: string;
  host: string;
  port: number;
  env: string;
  redisHost: string;
  redisPort: number;
  redisPassword?: string;
  pusherAppId: string;
  pusherKey: string;
  pusherSecret: string;
  pusherCluster: string;
  jwtSecret: string;

  constructor() {
    this.dbHost = checkEnv("DB_HOST");
    this.dbName = checkEnv("DB_NAME");
    this.dbUser = checkEnv("DB_USER");
    this.dbPassword = checkEnv("DB_PASSWORD");
    this.dbPort = parseInt(checkEnv("DB_PORT", 5432), 10);
    this.port = parseInt(checkEnv("PORT", 3000), 10);
    this.host = checkEnv("HOST", "http://localhost");
    this.env = checkEnv("NODE_ENV", "development");
    this.redisHost = checkEnv("REDIS_HOST", "http://localhost");
    this.redisPort = parseInt(checkEnv("REDIS_PORT", 6379), 10);
    this.redisPassword = checkEnv("REDIS_PASSWORD", "");
    this.pusherAppId = checkEnv("PUSHER_APPID");
    this.pusherKey = checkEnv("PUSHER_KEY");
    this.pusherSecret = checkEnv("PUSHER_SECRET");
    this.pusherCluster = checkEnv("PUSHER_CLUSTER");
    this.jwtSecret = checkEnv("JWT_TOKEN_SECRET");
  }
}

const checkEnv = (envVar: string, defaultValue?: any) => {
  if (process.env[envVar] === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Please define the Environment variable"${envVar}"`);
  } else {
    return process.env[envVar] as string;
  }
};
