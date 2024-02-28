export interface ICache {
  get<R>(key: string): Promise<R>;
  set<T>(key: string, data: T): Promise<void>;
  remove(key: string): Promise<void>;
}
