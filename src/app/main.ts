import "reflect-metadata";
import "dotenv/config";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { InversifyExpressServer } from "inversify-express-utils";

import { container } from "./configurations/ioc";
import { GlobalErrorHandler, NotFoundErrorHandler, Logger } from "./helpers";
import "./controllers/v1/GameController";

import { TYPES } from "#src/domain/types.js";
import { IConfig } from "#src/domain/boundaries/output";

const server = new InversifyExpressServer(container, null, { rootPath: "/api" });

server.setConfig(async (app) => {
  // it is not a good practice to disable cors in real production app but for the purpose of this application it is totally okay
  app.use(cors());
  // add body parser
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());
  app.set("trust proxy", 1);
  app.use(morgan("tiny"));
});

server.setErrorConfig((app) => {
  app.use(NotFoundErrorHandler);
  app.use(GlobalErrorHandler);
});

export const app = server.build();

const config = container.get<IConfig>(TYPES.Config);
app.listen(config.port, () => {
  Logger.info(`Server started on ${config.host}:${config.port}`);
});
