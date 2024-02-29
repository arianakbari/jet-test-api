import "reflect-metadata";
import { Repository } from "typeorm";
import { Container, ContainerModule } from "inversify";
import { Redis } from "ioredis";

import { TYPES } from "#src/domain/types.js";
import { IPlayerService, IMoveService } from "#src/domain/common";
import {
  IPlayerDAO,
  IConfig,
  IMoveDAO,
  IGameDAO,
  ICache,
  INotificationService,
  ITokenService,
} from "#src/domain/boundaries/output";
import { IGameService } from "#src/domain/boundaries/input";
import { PlayerService, GameService, MoveService } from "#src/domain/services/index.js";

import { dataSource } from "#src/app/configurations/db/index.js";
import { redis } from "#src/app/configurations/cache/index.js";
import { Player, Game, Move } from "#src/app/models/index.js";
import { Config } from "#src/app/configurations/config/index.js";
import {
  PlayerDAO,
  GameDAO,
  MoveDAO,
  CacheService,
  NotificationService,
  TokenService,
} from "#src/app/services/index.js";
import { ExtractUserMiddleware } from "#src/app/middlewares/index.js";

export const container = new Container();

const bindings = new ContainerModule((bind) => {
  bind<IConfig>(TYPES.Config).to(Config).inSingletonScope();
  bind<ICache>(TYPES.Cache).to(CacheService).inSingletonScope();
  bind<INotificationService>(TYPES.NotificationService).to(NotificationService).inSingletonScope();
  bind<ITokenService>(TYPES.TokenService).to(TokenService).inSingletonScope();
  bind<ExtractUserMiddleware>(TYPES.ExtractUserMiddleware).to(ExtractUserMiddleware).inSingletonScope();
  bind<IPlayerDAO>(TYPES.PlayerDAO).to(PlayerDAO).inSingletonScope();
  bind<IPlayerService>(TYPES.PlayerService).to(PlayerService).inSingletonScope();
  bind<IGameDAO>(TYPES.GameDAO).to(GameDAO).inSingletonScope();
  bind<IGameService>(TYPES.GameService).to(GameService).inSingletonScope();
  bind<IMoveDAO>(TYPES.MoveDAO).to(MoveDAO).inSingletonScope();
  bind<IMoveService>(TYPES.MoveService).to(MoveService).inSingletonScope();
  bind<Repository<Player>>(TYPES.PlayerRepository)
    .toDynamicValue(() => {
      return dataSource.getRepository(Player);
    })
    .inRequestScope();

  bind<Repository<Game>>(TYPES.GameRepository)
    .toDynamicValue(() => {
      return dataSource.getRepository(Game);
    })
    .inRequestScope();

  bind<Repository<Move>>(TYPES.MoveRepository)
    .toDynamicValue(() => {
      return dataSource.getRepository(Move);
    })
    .inRequestScope();

  bind<Redis>(TYPES.Redis)
    .toDynamicValue(() => {
      return redis;
    })
    .inSingletonScope();
});

container.load(bindings);
