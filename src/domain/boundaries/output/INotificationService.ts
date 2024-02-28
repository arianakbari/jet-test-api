import { GAME_EVENTS } from "#src/domain/entities";

export interface INotificationService {
  send<T>(playerId: string, data: T, event: GAME_EVENTS): Promise<void>;
  authorizeChannel(
    playerId: string,
    socketId: string,
  ): Promise<{ auth: string; channel_data?: string; shared_secret?: string; channelId: string }>;
}
