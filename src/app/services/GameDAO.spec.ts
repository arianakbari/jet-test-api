import { faker } from "@faker-js/faker";
import { GameDAO } from "./GameDAO";
import { GAME_STATUS, GameNotFoundException } from "#src/domain";

describe("GameDAO", () => {
  describe("createNewGame()", () => {
    it("should create a new game with given number", async () => {
      const game = {
        id: faker.datatype.uuid(),
        number: faker.datatype.number({ max: 100 }),
        status: GAME_STATUS.WAITING_FOR_PLAYER,
      };
      const gameDAO = new GameDAO({
        create: () => game,
        save: () => Promise.resolve(game),
      } as any);

      const result = await gameDAO.createNewGame(10);

      expect(result).toBeTruthy();
      expect(result.id).toEqual(game.id);
      expect(result.number).toEqual(game.number);
      expect(result.status).toEqual(GAME_STATUS.WAITING_FOR_PLAYER);
      expect(result.players.length).toEqual(0);
    });
  });

  describe("findJoinableGame()", () => {
    it("should return joinable game if exists", async () => {
      const game = {
        number: faker.datatype.number(),
        id: faker.datatype.uuid(),
        status: GAME_STATUS.WAITING_FOR_PLAYER,
        players: [] as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const gameDAO = new GameDAO({
        findOne: () => Promise.resolve(game),
      } as any);

      const result = await gameDAO.findJoinableGame();

      expect(result).toBeTruthy();
      expect(result.id).toEqual(game.id);
      expect(result.number).toEqual(game.number);
      expect(result.status).toEqual(GAME_STATUS.WAITING_FOR_PLAYER);
    });

    it("should throw if joinable game does not exist", async () => {
      const gameDAO = new GameDAO({
        findOne: () => Promise.resolve(null),
      } as any);
      await expect(gameDAO.findJoinableGame()).rejects.toThrow(GameNotFoundException);
    });
  });
  describe("setGameStatus()", () => {
    it("should set game status without throwing", async () => {
      const gameDAO = new GameDAO({
        update: () => Promise.resolve({ affected: 1 }),
      } as any);

      await expect(gameDAO.setGameStatus("", GAME_STATUS.FINISHED)).resolves.not.toThrow();
    });

    it("should throw if there is no game with given id", async () => {
      const gameDAO = new GameDAO({
        update: () => Promise.resolve({ affected: 0 }),
      } as any);

      await expect(gameDAO.setGameStatus("", GAME_STATUS.FINISHED)).rejects.toThrow(GameNotFoundException);
    });
  });
  describe("finishGame()", () => {
    it("should finish game without throwing", async () => {
      const gameDAO = new GameDAO({
        update: () => Promise.resolve({ affected: 1 }),
      } as any);

      await expect(gameDAO.finishGame("", "")).resolves.not.toThrow();
    });

    it("should throw if there is no game with given id", async () => {
      const gameDAO = new GameDAO({
        update: () => Promise.resolve({ affected: 0 }),
      } as any);

      await expect(gameDAO.finishGame("", "")).rejects.toThrow(GameNotFoundException);
    });
  });
});
