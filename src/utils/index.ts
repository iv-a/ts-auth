import ms from "ms";

export const getExpirationDate = (maxAge: string) => {
  return new Date(Date.now() + ms(maxAge));
}

export * from './cookies';