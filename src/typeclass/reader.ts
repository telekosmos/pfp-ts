import { Functor2 } from 'fp-ts/Functor'

type RReader<R, A> = (env: R) => A
// of: <A> (value: A) => F<A>
// chain: <A, B> (f: (a: A) => F<B>) => (fa: F<A>) => F<B>
export const URI = 'RReader'
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly RReader: RReader<E, A>
  }
}

// <E, A, B>(fa: Reader<E, A>, f: (a: A) => B) => Reader<E, B>
const Functor: Functor2<URI> = {
  URI,
  map: <E, A, B>(fa: RReader<E, A>, f: (a: A) => B) => {
    return (env: E) => f(fa(env));
  }
}

// Example
type FractionConfig = {
    denominator: number;
};
// type Fraction = (numerator: number) => R.Reader<ReaderConfig, number>
// type Fraction = (numerator: number) => (config: ReaderConfig) => number
type FractionReader = RReader<FractionConfig, number>
type Fraction = (numerator: number) => FractionReader
const config: FractionConfig = {
  denominator: 3
}

let res: any
const cfg: FractionConfig = { denominator: 4 }
const f: (n: number) => RReader<FractionConfig, number> = n => deps => n/deps.denominator
const theFraction: Fraction = n => deps => n/deps.denominator
res = theFraction(2)(cfg)
res
const stringi: (n: number) => RReader<FractionConfig, string> = n => deps => `${n}/${deps.denominator}`
res = stringi(4)(cfg)
res

// From function to Reader
// const fraction: (n: number, d: number) => number = (n: number, d: number): number => n / d
// const fraction = (n: number, d: number): number => n / d
// const pfraction = (n: number) => (d: number): number => n / d
const preFraction: (n: number, d: number) => number = (n, d): number => n/d
const fraction: (n: number) => (d: number) => number = (n: number) => (d: number) => n/d
const postFraction = (n: number) => (d: number): number => n/d
const fr2 = (n: number): RReader<FractionConfig, number> => deps => n/deps.denominator
const fr21: (n: number) => RReader<FractionConfig, number> =
  n => deps => n/deps.denominator
res = fr2(6)(cfg) === fr21(6)(cfg)
res
