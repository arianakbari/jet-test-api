import { sign } from "jsonwebtoken";
import { TokenService } from "./TokenService";
import { faker } from "@faker-js/faker";

describe("TokenService", () => {
  describe("sign()", () => {
    it("should sign and return token", async () => {
      const tokenService = new TokenService({
        jwtSecret: "secret",
      } as any);
      const payload = { id: faker.datatype.uuid(), email: faker.internet.email() };

      const result = await tokenService.sign<typeof payload>(payload);

      sign(payload, "secret", (error, encoded) => {
        if (error) throw error;
        expect(result).toBeTruthy();
        expect(result).toEqual(encoded);
      });
    });
  });
  describe("verify()", () => {
    it("should verify and return payload", async () => {
      const tokenService = new TokenService({
        jwtSecret: "secret",
      } as any);
      const payload = { id: faker.datatype.uuid(), email: faker.internet.email() };

      const token = await tokenService.sign<typeof payload>(payload);

      const result = await tokenService.verify<typeof payload>(token);

      expect(result).toBeTruthy();
      expect(result.id).toEqual(payload.id);
      expect(result.email).toEqual(payload.email);
    });
  });
});
