import { faker } from "@faker-js/faker";
import { IMoveDAO } from "#src/domain/boundaries";
import { Move, MoveService } from "#src/domain";

describe("MoveService", () => {
  describe("createRecord()", () => {
    it("should create and return with given data", async () => {
      const move = {
        id: faker.datatype.uuid(),
        choice: 1,
        value: 60,
        game: {} as any,
        player: {} as any,
      };
      const moveDAO: IMoveDAO = {
        createRecord(): Promise<Move> {
          return Promise.resolve(move);
        },
      };

      const moveService = new MoveService(moveDAO);

      const result = await moveService.createRecord(1, 1, {} as any, {} as any);

      expect(result).toBeTruthy();
      expect(result.id).toEqual(move.id);
      expect(result.choice).toEqual(move.choice);
      expect(result.value).toEqual(move.value);
    });
  });
});
