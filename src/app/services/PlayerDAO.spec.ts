import { faker } from "@faker-js/faker";
import { PlayerNotFoundException } from "#src/domain/entities";
import { PlayerDAO } from "./PlayerDAO";

describe("PlayerDAO", () => {
  describe("create()", () => {
    it("should create player with given email", async () => {
      const player = {
        email: faker.internet.email(),
        id: faker.datatype.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const playerDAO = new PlayerDAO({
        create: () => player,
        save: () => Promise.resolve(player),
      } as any);

      const result = await playerDAO.create(player.email);

      expect(result).toBeTruthy();
      expect(result.id).toEqual(player.id);
      expect(result.email).toEqual(player.email);
    });
  });
  describe("findByEmail()", () => {
    it("should return player if exists", async () => {
      const player = {
        email: faker.internet.email(),
        id: faker.datatype.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const playerDAO = new PlayerDAO({
        findOne: () => Promise.resolve(player),
      } as any);

      const result = await playerDAO.findByEmail(player.email);

      expect(result).toBeTruthy();
      expect(result.id).toEqual(player.id);
      expect(result.email).toEqual(player.email);
    });

    it("should throw if player does not exist", async () => {
      const playerDAO = new PlayerDAO({
        findOne: () => Promise.resolve(null),
      } as any);
      await expect(async () => {
        await playerDAO.findByEmail(faker.internet.email());
      }).rejects.toThrow(PlayerNotFoundException);
    });
  });
  describe("getInProgressGameId()", () => {
    it("should return the id of in progress game", async () => {
      const player = {
        email: faker.internet.email(),
        id: faker.datatype.uuid(),
        activeGameId: faker.datatype.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const playerDAO = new PlayerDAO({
        findOne: () => Promise.resolve(player),
      } as any);

      const result = await playerDAO.getInProgressGameId(player.id);

      expect(result).toBeTruthy();
      expect(result).toEqual(player.activeGameId);
    });
    it("should return null if there is not any in progress game", async () => {
      const playerDAO = new PlayerDAO({
        findOne: () => Promise.resolve(null),
      } as any);

      const result = await playerDAO.getInProgressGameId("");

      expect(result).toBeFalsy();
      expect(result).toBeNull();
    });
  });

  describe("setInProgressGameId()", () => {
    it("should set game id without throwing", async () => {
      const playerDAO = new PlayerDAO({
        update: () => Promise.resolve({ affected: 1 }),
      } as any);

      await expect(playerDAO.setInProgressGameId("", "")).resolves.not.toThrow();
    });

    it("should throw if there is no player with given id", async () => {
      const playerDAO = new PlayerDAO({
        update: () => Promise.resolve({ affected: 0 }),
      } as any);

      await expect(async () => await playerDAO.setInProgressGameId("", "")).rejects.toThrow(PlayerNotFoundException);
    });
  });

  describe("resetActiveGame()", () => {
    it("should reset players active game without throwing", async () => {
      const playerDAO = new PlayerDAO({
        update: () => Promise.resolve({ affected: 2 }),
      } as any);

      await expect(playerDAO.resetActiveGame(["", ""], "")).resolves.not.toThrow();
    });

    it("should throw if there is not exact 2 player", async () => {
      const playerDAO = new PlayerDAO({
        update: () => Promise.resolve({ affected: 0 }),
      } as any);

      await expect(async () => await playerDAO.resetActiveGame(["", ""], "")).rejects.toThrow(PlayerNotFoundException);
    });
  });
});
