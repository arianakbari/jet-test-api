import { faker } from "@faker-js/faker";
import { PlayerService } from "./PlayerService";
import { IPlayerDAO } from "#src/domain/boundaries";
import { Player, PlayerNotFoundException } from "#src/domain/entities";

describe("PlayerService", () => {
  describe("findOrCreate()", () => {
    it("should return player if exists", async () => {
      const player = { email: faker.internet.email(), id: faker.datatype.uuid() };
      const playerDAOMock: IPlayerDAO = {
        findByEmail(): Promise<Player> {
          return Promise.resolve(player);
        },
        create: jest.fn(),
        getInProgressGameId: jest.fn(),
        setInProgressGameId: jest.fn(),
        resetActiveGame: jest.fn(),
      };
      const playerService = new PlayerService(playerDAOMock);

      const result = await playerService.findOrCreate(player.email);

      expect(result).toBeTruthy();
      expect(result.email).toEqual(player.email);
      expect(result.id).toEqual(result.id);
    });

    it("should throw error and create new player if there is not any", async () => {
      const player = { email: faker.internet.email(), id: faker.datatype.uuid() };
      const playerDAOMock: IPlayerDAO = {
        findByEmail(): Promise<Player> {
          throw new PlayerNotFoundException("");
        },
        create(): Promise<Player> {
          return Promise.resolve(player);
        },
        getInProgressGameId: jest.fn(),
        setInProgressGameId: jest.fn(),
        resetActiveGame: jest.fn(),
      };
      const playerService = new PlayerService(playerDAOMock);

      const result = await playerService.findOrCreate(player.email);

      expect(result).toBeTruthy();
      expect(result.email).toEqual(player.email);
      expect(result.id).toEqual(result.id);
    });
  });
  describe("getInProgressGameId()", () => {
    it("should return in progress game id", async () => {
      const id = faker.datatype.uuid();
      const playerDAO: IPlayerDAO = {
        getInProgressGameId(): Promise<string> {
          return Promise.resolve(id);
        },
        findByEmail: jest.fn(),
        setInProgressGameId: jest.fn(),
        create: jest.fn(),
        resetActiveGame: jest.fn(),
      };
      const playerService = new PlayerService(playerDAO);

      const result = await playerService.getInProgressGameId(id);

      expect(result).toBeTruthy();
      expect(result).toEqual(id);
    });
  });

  describe("setInProgressGameId()", () => {
    it("should not throw any error", async () => {
      const playerDAO: IPlayerDAO = {
        getInProgressGameId: jest.fn(),
        findByEmail: jest.fn(),
        setInProgressGameId: () => Promise.resolve(),
        create: jest.fn(),
        resetActiveGame: jest.fn(),
      };
      const playerService = new PlayerService(playerDAO);

      expect(() => playerService.setInProgressGameId("", "")).not.toThrow();
    });
  });

  describe("resetActiveGame()", () => {
    it("should not throw any error", async () => {
      const playerDAO: IPlayerDAO = {
        getInProgressGameId: jest.fn(),
        findByEmail: jest.fn(),
        setInProgressGameId: jest.fn(),
        create: jest.fn(),
        resetActiveGame: () => Promise.resolve(),
      };
      const playerService = new PlayerService(playerDAO);

      expect(() => playerService.resetActiveGame([], "")).not.toThrow();
    });
  });
});
