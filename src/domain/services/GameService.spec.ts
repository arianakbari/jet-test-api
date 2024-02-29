import { ForbiddenException, GAME_STATUS, GameNotFoundException, GameService } from "#src/domain";
import { faker } from "@faker-js/faker";

describe("GameService", () => {
  describe("joinGame()", () => {
    it("should return player's active game", async () => {
      const gameService = new GameService(
        {} as any,
        {} as any,
        {
          findOrCreate: () => Promise.resolve({ id: "" }),
          getInProgressGameId: () => Promise.resolve(faker.datatype.uuid()),
        } as any,
        {} as any,
        {} as any,
        {} as any,
      );
      const data = {
        token: "abcd",
        game: {
          id: faker.datatype.uuid(),
          number: faker.datatype.number(),
          status: GAME_STATUS.WAITING_FOR_PLAYER,
          players: [{ email: faker.internet.email(), id: faker.datatype.uuid() }],
        },
      };
      jest.spyOn(gameService as any, "getPlayerActiveGame").mockImplementationOnce(() => Promise.resolve(data));

      const result = await gameService.joinGame("");

      expect(result).toBeTruthy();
      expect(result.game.id).toEqual(result.game.id);
    });
    it("should return an existing game session", async () => {
      const game = {
        id: faker.datatype.uuid(),
        number: faker.datatype.number(),
        status: GAME_STATUS.IN_PROGRESS,
        players: [{ email: faker.internet.email(), id: faker.datatype.uuid() }],
      };
      const gameService = new GameService(
        { findJoinableGame: () => Promise.resolve(game) } as any,
        {} as any,
        {
          findOrCreate: () => Promise.resolve({ id: "" }),
          getInProgressGameId: () => Promise.resolve(null),
        } as any,
        {} as any,
        {} as any,
        {} as any,
      );

      jest
        .spyOn(gameService as any, "startGame")
        .mockImplementationOnce(() => Promise.resolve({ token: "some-token", game }));

      const result = await gameService.joinGame("");

      expect(result).toBeTruthy();
      expect(result.token).toBeTruthy();
      expect(result.game.id).toEqual(game.id);
      expect(result.game.status).toEqual(GAME_STATUS.IN_PROGRESS);
    });
    it("should return a new game session alongside token", async () => {
      const game = {
        id: faker.datatype.uuid(),
        number: faker.datatype.number(),
        status: GAME_STATUS.WAITING_FOR_PLAYER,
        players: [{ email: faker.internet.email(), id: faker.datatype.uuid() }],
      };
      const gameService = new GameService(
        { findJoinableGame: () => Promise.reject(new GameNotFoundException("")) } as any,
        {} as any,
        {
          findOrCreate: () => Promise.resolve({ id: "" }),
          getInProgressGameId: () => Promise.resolve(null),
        } as any,
        {} as any,
        {} as any,
        {} as any,
      );

      jest
        .spyOn(gameService as any, "createNewGame")
        .mockImplementationOnce(() => Promise.resolve({ token: "some-token", game }));

      const result = await gameService.joinGame("");

      expect(result).toBeTruthy();
      expect(result.token).toBeTruthy();
      expect(result.game.id).toEqual(game.id);
      expect(result.game.status).toEqual(GAME_STATUS.WAITING_FOR_PLAYER);
    });
  });
  describe("makeMove()", () => {
    it("should throw if game does not belong to player or it is not his turn to play", async () => {
      const game = {
        id: faker.datatype.uuid(),
        number: faker.datatype.number(),
        status: GAME_STATUS.IN_PROGRESS,
        players: [
          { email: faker.internet.email(), id: faker.datatype.uuid() },
          { email: faker.internet.email(), id: faker.datatype.uuid() },
        ],
      };
      const gameService = new GameService(
        {} as any,
        { get: () => Promise.resolve(game) } as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
      );

      await expect(gameService.makeMove(game.id, { id: faker.datatype.uuid(), email: "" }, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
    it("should finish the game and return finished game session", async () => {
      const player = { email: faker.internet.email(), id: faker.datatype.uuid() };
      const game = {
        id: faker.datatype.uuid(),
        number: 1,
        status: GAME_STATUS.IN_PROGRESS,
        players: [player, { email: faker.internet.email(), id: faker.datatype.uuid() }],
        currentTurnPlayerId: player.id,
      };
      const gameService = new GameService(
        { finishGame: () => Promise.resolve() } as any,
        { get: () => Promise.resolve(game), remove: () => Promise.resolve() } as any,
        {
          resetActiveGame: () => Promise.resolve(),
        } as any,
        {} as any,
        { send: () => Promise.resolve() } as any,
        {} as any,
      );

      jest.spyOn(gameService as any, "playTurn").mockImplementationOnce(() => Promise.resolve(game));

      const result = await gameService.makeMove(game.id, player, 1);

      expect(result).toBeTruthy();
      expect(result.id).toEqual(game.id);
      expect(result.status).toEqual(GAME_STATUS.FINISHED);
      expect(result.currentTurnPlayerId).toEqual(null);
    });
    it("should flip the turn and return game session", async () => {
      const player1 = { email: faker.internet.email(), id: faker.datatype.uuid() };
      const player2 = { email: faker.internet.email(), id: faker.datatype.uuid() };
      const game = {
        id: faker.datatype.uuid(),
        number: 5,
        status: GAME_STATUS.IN_PROGRESS,
        players: [player1, player2],
        currentTurnPlayerId: player1.id,
      };
      const gameService = new GameService(
        {} as any,
        { set: () => Promise.resolve(), get: () => Promise.resolve(game) } as any,
        {} as any,
        {} as any,
        { send: () => Promise.resolve() } as any,
        {} as any,
      );

      jest.spyOn(gameService as any, "playTurn").mockImplementationOnce(() => Promise.resolve(game));

      const result = await gameService.makeMove(game.id, player1, 1);

      expect(result).toBeTruthy();
      expect(result.id).toEqual(game.id);
      expect(result.status).toEqual(GAME_STATUS.IN_PROGRESS);
      expect(result.currentTurnPlayerId).toEqual(player2.id);
    });
  });
  describe("subscribe()", () => {
    it("should return subscription credentials without throwing error", async () => {
      const gameService = new GameService(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        { authorizeChannel: () => Promise.resolve() } as any,
        {} as any,
      );

      await expect(gameService.subscribe({ id: "", email: "" }, "")).resolves.not.toThrow();
    });
  });
});
