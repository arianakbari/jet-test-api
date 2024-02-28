import joi from "joi";

export const joinGameValidator = joi.object({
  email: joi.string().email().required(),
});

export const makeMoveValidator = joi.object({
  choice: joi.number().valid(0, 1, -1).required(),
  gameId: joi.string().uuid({ version: "uuidv4" }).required(),
});

export const subscribeValidator = joi.object({
  socketId: joi.string().required(),
});
