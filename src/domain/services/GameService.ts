import { inject, injectable } from "inversify";
import "reflect-metadata";

import {
  ForbiddenException,
  Game,
  GAME_EVENTS,
  GAME_STATUS,
  GameNotFoundException,
  GameSession,
  Player,
} from "#src/domain/entities/index.js";
import { GameResponse, IGameService } from "#src/domain/boundaries/input";
import {
  type ICache,
  type IGameDAO,
  type INotificationService,
  type ITokenService,
} from "#src/domain/boundaries/output";
import { type IMoveService, type IPlayerService } from "#src/domain/common";
import { TYPES } from "#src/domain/types.js";

@injectable()
export class GameService implements IGameService {
  constructor(
    @inject(TYPES.GameDAO) private readonly gameDAO: IGameDAO,
    @inject(TYPES.Cache) private readonly cache: ICache,
    @inject(TYPES.PlayerService) private readonly playerService: IPlayerService,
    @inject(TYPES.MoveService) private readonly moveService: IMoveService,
    @inject(TYPES.NotificationService) private readonly notificationService: INotificationService,
    @inject(TYPES.TokenService) private readonly tokenService: ITokenService,
  ) {}

  async joinGame(email: string): Promise<GameResponse> {
    // Find or create player with given email
    const player = await this.playerService.findOrCreate(email);

    // Check if player has active game
    const activeGameId = await this.playerService.getInProgressGameId(player.id);
    // if player has active game then return current state of the game from cache alongside the token
    if (activeGameId) return this.getPlayerActiveGame(activeGameId, player);

    // find a joinable game and start
    let game: Game;

    try {
      game = await this.gameDAO.findJoinableGame();
      return this.startGame(game, player);
    } catch (e) {
      // create a new game and wait for another player to join
      if (e instanceof GameNotFoundException) {
        return this.createNewGame(player);
      }
      throw e;
    }
  }

  async makeMove(gameId: string, player: Player, choice: number): Promise<GameSession> {
    // get game session from cache
    let game = await this.cache.get<GameSession>(gameId);
    const otherPlayersId = game.players.find((p) => p.id !== player.id).id;
    // check if this player belongs to this game
    if (!game.players.find((p) => p.id === player.id)) {
      // throw error
      throw new ForbiddenException("This player does not belong to this game!");
    }
    // check if player's turn to play
    if (game.currentTurnPlayerId !== player.id) {
      // throw error
      throw new ForbiddenException("It is not player's turn!");
    }
    // allow player to play his turn and save his move
    game = await this.playTurn(game, player, choice);
    // check whether game is finished or not and save it
    if (game.number <= 1) {
      // set winner id and status of the game
      await this.gameDAO.finishGame(game.id, player.id);
      // reset both players active game
      await this.playerService.resetActiveGame(
        game.players.map((p) => p.id),
        game.id,
      );
      // remove game session from cache
      await this.cache.remove(game.id);
      // notify other user
      const session: GameSession = {
        ...game,
        status: GAME_STATUS.FINISHED,
        currentTurnPlayerId: null,
      };

      await this.notificationService.send<GameSession>(otherPlayersId, session, GAME_EVENTS.FINISHED);
      return session;
    }
    // change turn and save game
    game.currentTurnPlayerId = otherPlayersId;
    await this.cache.set(game.id, game);
    // notify other player
    await this.notificationService.send<GameSession>(otherPlayersId, game, GAME_EVENTS.TURN_PLAYED);

    return game;
  }

  async subscribe(
    player: Player,
    socketId: string,
  ): Promise<{ auth: string; channel_data?: string; shared_secret?: string; channelId: string }> {
    return this.notificationService.authorizeChannel(player.id, socketId);
  }

  private async getPlayerActiveGame(gameId: string, player: Player): Promise<GameResponse> {
    const game = await this.cache.get<GameSession>(gameId);
    const token = await this.tokenService.sign({ id: player.id, email: player.email });
    return { game, token };
  }

  private async startGame(game: Game, player: Player): Promise<GameResponse> {
    // set game status to in progress
    await this.gameDAO.setGameStatus(game.id, GAME_STATUS.IN_PROGRESS);
    // set active game of player
    await this.playerService.setInProgressGameId(player.id, game.id);
    // save game session in cache
    const session: GameSession = {
      id: game.id,
      number: game.number,
      currentTurnPlayerId: player.id,
      players: [...game.players, player],
      status: GAME_STATUS.IN_PROGRESS,
    };
    await this.cache.set(game.id, session);
    // notify other player that new player joined
    await this.notificationService.send<GameSession>(
      session.players.find((p) => p.id !== player.id).id,
      session,
      GAME_EVENTS.JOINED,
    );
    // return game and user token
    return {
      game: session,
      token: await this.tokenService.sign({ id: player.id, email: player.email }),
    };
  }

  private async createNewGame(player: Player): Promise<GameResponse> {
    const initialNumber = this.generateRandomNumber();
    // create new game
    const game = await this.gameDAO.createNewGame(initialNumber);
    // set active game of player
    await this.playerService.setInProgressGameId(player.id, game.id);
    // save it to cache
    const gameSession: GameSession = {
      id: game.id,
      number: initialNumber,
      currentTurnPlayerId: null,
      players: [player],
      status: GAME_STATUS.WAITING_FOR_PLAYER,
    };
    await this.cache.set(game.id, gameSession);
    // return game and user token
    return {
      game: gameSession,
      token: await this.tokenService.sign({ id: player.id, email: player.email }),
    };
  }

  private async playTurn(game: GameSession, player: Player, choice: number): Promise<GameSession> {
    const newNumber = Math.floor((game.number + choice) / 3);
    await this.moveService.createRecord(choice, game.number, player, game);
    game.number = newNumber;
    return game;
  }

  private generateRandomNumber(min = 10, max = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
