import { inject, injectable } from "inversify";
import { verify, sign } from "jsonwebtoken";
import "reflect-metadata";

import { type IConfig, ITokenService } from "#src/domain/boundaries/output";
import { TYPES } from "#src/domain/types.js";

@injectable()
export class TokenService implements ITokenService {
  constructor(@inject(TYPES.Config) private readonly config: IConfig) {}

  sign<T>(data: T): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(data as object, this.config.jwtSecret, { expiresIn: "1d" }, (err, encoded) => {
        if (err) reject(err);
        return resolve(encoded);
      });
    });
  }

  verify<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      verify(token, this.config.jwtSecret, (err, payload) => {
        if (err) reject(err);
        return resolve(payload as T);
      });
    });
  }
}
