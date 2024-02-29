import swaggerJsDoc from "swagger-jsdoc";
import { IConfig } from "#src/domain/boundaries";

export const getSwaggerSpec = (config: IConfig) => {
  const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "JET Test Express API with Swagger",
        version: "0.1.0",
        description: "This is a game of three API made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
      },
      servers: [
        {
          url: `${config.host}:${config.port}`,
        },
      ],
    },
    apis: ["**/controllers/v1/GameController.ts"],
  };

  return swaggerJsDoc(options);
};
