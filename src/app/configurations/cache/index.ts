import { Redis } from "ioredis";
import { Config } from "#src/app/configurations/config/index.js";

// We have to instantiate settings manually here because we are outside of ioc container
const config = new Config();

const redisOptions: any = {
  host: config.redisHost,
  port: config.redisPort,
};

if (config.redisPassword) redisOptions.password = config.redisPassword;

export const redis = new Redis(redisOptions);
