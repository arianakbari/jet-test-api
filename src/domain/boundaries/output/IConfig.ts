export interface IConfig {
  port: number;
  host: string;
  env: string;
  jwtSecret: string;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbPort: number;
  dbName: string;
  redisHost: string;
  redisPort: number;
  redisPassword?: string;
  pusherAppId: string;
  pusherKey: string;
  pusherSecret: string;
  pusherCluster: string;
}
