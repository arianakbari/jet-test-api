import { type Request } from "express";
import { controller, httpPost, request, requestBody } from "inversify-express-utils";
import { inject } from "inversify";
import "reflect-metadata";

import { type IGameService } from "#src/domain/boundaries/input";
import { TYPES } from "#src/domain/types.js";

import { ValidateBodyMiddleware } from "#src/app/middlewares/index.js";
import { joinGameValidator, makeMoveValidator, subscribeValidator } from "#src/app/validators/index.js";

@controller("/v1/game")
export class GameController {
  constructor(@inject(TYPES.GameService) private readonly gameService: IGameService) {}

  /**
   * @swagger
   * components:
   *   schemas:
   *     Player:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: The auto-generated uuid v4 of the player
   *         email:
   *           type: string
   *           description: User's email
   *       required:
   *         - id
   *         - email
   *       example:
   *         id: fc0c5d1b-56d2-412d-98a6-3905ac011f93
   *         email: test1@gmail.com
   *     Game:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: The auto-generated uuid v4 of the game
   *         number:
   *           type: number
   *           description: Initial number that game starts with
   *         status:
   *           type: string
   *           enum:
   *             - WAITING_FOR_PLAYER
   *             - IN_PROGRESS
   *             - FINISHED
   *           description: Status of the game
   *         players:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Player'
   *           description: Player of the game
   *         winner:
   *           $ref: '#/components/schemas/Player'
   *           description: Winner of the game
   *       required:
   *         - id
   *         - number
   *         - status
   *         - players
   *       example:
   *         id: 6d8b0410-9cb8-4d3f-af5a-f6a6d6f9d7a2
   *         number: 50
   *         status: IN_PROGRESS
   *         players:
   *           - id: fc0c5d1b-56d2-412d-98a6-3905ac011f93
   *             email: test1@gmail.com
   *           - id: e438e764-93e0-4c54-a1e6-85efe9aa2bd8
   *             email: test2@gmail.com
   *         winner:
   *           id: fc0c5d1b-56d2-412d-98a6-3905ac011f93
   *           email: test1@gmail.com
   *
   *     GameResponse:
   *       type: object
   *       properties:
   *         game:
   *           $ref: '#/components/schemas/Game'
   *           description: Game Session
   *         token:
   *           type: string
   *           description: JWT token
   *       required:
   *         - game
   *         - token
   */
  /**
   * @swagger
   * tags:
   *   name: Game
   *   description: The game APIs
   * api/v1/game/join:
   *   post:
   *     summary: Create or join an existing game
   *     tags: [Game]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the player
   *     responses:
   *       200:
   *         description: The game session with JWT token.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GameResponse'
   *
   * api/v1/game/make-move:
   *   post:
   *     summary: Player make move
   *     tags: [Game]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               choice:
   *                 type: number
   *                 enum:
   *                   - 0
   *                   - 1
   *                   - -1
   *                 description: Player's choice
   *               gameId:
   *                 type: string
   *                 description: Id of the game
   *     responses:
   *       200:
   *         description: The game session.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Game'
   *
   * api/v1/game/subscribe:
   *   post:
   *     summary: Subscribe to game events
   *     tags: [Game]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               socketId:
   *                 type: string
   *     responses:
   *       200:
   *         description: The token and channel id
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 channelId:
   *                   type: string
   *                   description: Id of the channel
   *                 auth:
   *                   type: string
   *                   description: Auth token for channel
   *
   */
  @httpPost("/join", ValidateBodyMiddleware(joinGameValidator))
  async joinGame(@requestBody() data: { email: string }) {
    return this.gameService.joinGame(data.email);
  }

  @httpPost("/make-move", TYPES.ExtractUserMiddleware, ValidateBodyMiddleware(makeMoveValidator))
  async makeMove(@requestBody() data: { gameId: string; choice: number }, @request() req: Request) {
    return this.gameService.makeMove(data.gameId, (req as any).user, data.choice);
  }

  @httpPost("/subscribe", TYPES.ExtractUserMiddleware, ValidateBodyMiddleware(subscribeValidator))
  async subscribe(@requestBody() data: { socketId: string }, @request() req: Request) {
    return this.gameService.subscribe((req as any).user, data.socketId);
  }
}
