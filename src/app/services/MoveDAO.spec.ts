import { faker } from "@faker-js/faker";
import { MoveDAO } from "./MoveDAO";

describe("MoveDAO", () => {
  describe("createRecord()", () => {
    it("should return created record", async () => {
      const move = {
        choice: 0,
        id: faker.datatype.uuid(),
        value: faker.datatype.number({ max: 10 }),
        playerId: faker.datatype.uuid(),
        gameId: faker.datatype.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const moveDAO = new MoveDAO({
        create: () => move,
        save: () => Promise.resolve(move),
      } as any);

      const result = await moveDAO.createRecord(0, 100, { id: "" } as any, { id: "" } as any);

      expect(result).toBeTruthy();
      expect(result.id).toEqual(move.id);
    });
  });
});
