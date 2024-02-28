import { NotificationService } from "./NotificationService";
import { GAME_EVENTS } from "#src/domain/entities";

describe("NotificationService", () => {
  describe("send()", () => {
    it("should send without throwing", async () => {
      const notificationService = new NotificationService({} as any);

      // We could inject pusher obj instead of initializing in the class itself, but just wanted to show another
      // ways of manipulating private fields
      Reflect.set(notificationService, "pusher", {
        trigger: () => Promise.resolve(),
      });

      await expect(notificationService.send("", {}, GAME_EVENTS.STARTED)).resolves.not.toThrow();
    });
  });

  describe("authorizeChannel()", () => {
    it("should authorize channel without throwing", async () => {
      const notificationService = new NotificationService({} as any);

      Reflect.set(notificationService, "pusher", {
        authorizeChannel: () => Promise.resolve({}),
      });

      await expect(notificationService.authorizeChannel("", "")).resolves.not.toThrow();
    });
  });
});
