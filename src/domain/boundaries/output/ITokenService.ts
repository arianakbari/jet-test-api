export interface ITokenService {
  sign<T>(data: T): Promise<string>;
  verify<T>(token: string): Promise<T>;
}
