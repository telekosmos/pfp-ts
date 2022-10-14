import { config } from 'dotenv';
import { Either, left, right, matchW } from 'fp-ts/lib/Either';

config()

const stringToInt = (x: string): Either<Error, number> => {
  const parsed = Number.parseInt(x, 10);
  return Number.isNaN(parsed)
    ? left(Error(`{x} is not a valid number`))
    : right(parsed)
}

const PORT:number = matchW((e: Error) => 3333, (v: number) => v)(stringToInt(process.env.PORT || '3333'));

console.log(`Would start something at port ${PORT}`)
