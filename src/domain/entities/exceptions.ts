export class PlayerNotFoundException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, PlayerNotFoundException.prototype);
  }
}

export class GameNotFoundException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, GameNotFoundException.prototype);
  }
}

export class EntityNotFoundInCacheException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, EntityNotFoundInCacheException.prototype);
  }
}

export class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
