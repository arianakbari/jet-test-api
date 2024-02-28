import "reflect-metadata";
import "dotenv/config";
import bodyParser from "body-parser";
import morgan from "morgan";
import { InversifyExpressServer } from "inversify-express-utils";

import { container, asyncBindings, bindings } from "./configurations/ioc";
import { dataSource } from "./configurations/db";
import { GlobalErrorHandler, NotFoundErrorHandler, Logger } from "./helpers";
import "./controllers/v1/GameController";

import { TYPES } from "#src/domain/types.js";
import { IConfig } from "#src/domain/boundaries/output";

const server = new InversifyExpressServer(container, null, { rootPath: "/api" });

server.setConfig(async (app) => {
  container.load(bindings);
  await container.loadAsync(asyncBindings);
  // add body parser
  app.set("trust proxy", 1);
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());
  app.use(morgan("tiny"));
});

server.setErrorConfig((app) => {
  app.use(NotFoundErrorHandler);
  app.use(GlobalErrorHandler);
});

export const app = server.build();

dataSource
  .initialize()
  .then(() => {
    Logger.info("Connection to db has been established!");
    const config = container.get<IConfig>(TYPES.Config);
    app.listen(config.port, () => {
      Logger.info(`Server started on ${config.host}:${config.port}`);
    });
  })
  .catch((e) => {
    Logger.error(e, "An exception raised!");
  });
