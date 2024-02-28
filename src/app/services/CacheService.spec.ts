import { CacheService } from "./CacheService";
import { EntityNotFoundInCacheException } from "#src/domain/entities";

describe("CacheService", () => {
  describe("get()", () => {
    it("should return the record in cache if exists", async () => {
      const record = 10;
      const cacheService = new CacheService({
        get() {
          return Promise.resolve(record);
        },
      } as any);

      const result = await cacheService.get<number>("");

      expect(result).toEqual(record);
    });

    it("should throw if the record is not in cache", async () => {
      const cacheService = new CacheService({
        get() {
          return Promise.resolve(null);
        },
      } as any);

      await expect(cacheService.get("")).rejects.toThrow(EntityNotFoundInCacheException);
    });
  });

  describe("set()", () => {
    it("should set data", async () => {
      const cacheService = new CacheService({
        set() {
          return Promise.resolve();
        },
      } as any);

      await expect(cacheService.set("", "")).resolves.not.toThrow();
    });
  });

  describe("remove()", () => {
    it("remove set data", async () => {
      const cacheService = new CacheService({
        del() {
          return Promise.resolve();
        },
      } as any);

      await expect(cacheService.remove("")).resolves.not.toThrow();
    });
  });
});
