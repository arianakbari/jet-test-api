import { inject, injectable } from "inversify";
import Pusher from "pusher";
import "reflect-metadata";

import { GAME_EVENTS } from "#src/domain/entities/index.js";
import { type IConfig, INotificationService } from "#src/domain/boundaries/output/index.js";
import { TYPES } from "#src/domain/types.js";

@injectable()
export class NotificationService implements INotificationService {
  constructor(@inject(TYPES.Config) private readonly config: IConfig) {}

  private readonly pusher = new Pusher({
    appId: this.config.pusherAppId,
    key: this.config.pusherKey,
    secret: this.config.pusherSecret,
    cluster: this.config.pusherCluster,
  });
  private getChannelName(playerId: string) {
    return `private-user-channel-${playerId}`;
  }
  async authorizeChannel(
    playerId: string,
    socketId: string,
  ): Promise<{
    auth: string;
    channel_data?: string;
    shared_secret?: string;
    channelId: string;
  }> {
    return {
      ...this.pusher.authorizeChannel(socketId, this.getChannelName(playerId)),
      channelId: this.getChannelName(playerId),
    };
  }

  async send<T>(playerId: string, data: T, event: GAME_EVENTS): Promise<void> {
    try {
      await this.pusher.trigger(this.getChannelName(playerId), event, data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
