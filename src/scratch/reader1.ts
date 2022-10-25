import { pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Reader'

interface Dependencies {
  i18n: {
    true: string
    false: string
  }
  lowerBound: number
}

const fb: (b: boolean) => string = b => b ? 'true': 'false'

// const fb = (b: boolean): ((n: number) => string) => n => b ? 'true' : 'false'
// const fb: (b: boolean) => ((n: number) => string) = b => n => b ? `${n}true` : `${n}false`
const f: (b: boolean, d: Dependencies) => string = (b, deps) => (b ? deps.i18n.true : deps.i18n.false)
const f1: (b: boolean) => ((deps: Dependencies) => string) =
  b => deps => (b ? deps.i18n.true : deps.i18n.false);

const f2 = (b: boolean): ((deps: Dependencies) => string) => {
  return deps => b ? deps.i18n.true : deps.i18n.false // (deps => b ? 'true' : 'false')
}

const f3 = (b: boolean): R.Reader<Dependencies, string> => (deps => b ? deps.i18n.true : deps.i18n.false)
const f31: (b: boolean) => R.Reader<Dependencies, string> = b => deps => b ? deps.i18n.true : deps.i18n.false

const g = (n: number): R.Reader<Dependencies, string> => f3(n > 2)
const g2 = (n: number): R.Reader<Dependencies, string> => pipe(
  R.ask<Dependencies>(), // Reader<Dependencies, Dependencies>
  R.chain(deps => f3(n > deps.lowerBound)), // Reader<Dependencies, string>
);
const g2b = (n: number): R.Reader<Dependencies, string> => deps => pipe(
  deps,
  f3(n > deps.lowerBound)
)
const g2c: (n: number) => R.Reader<Dependencies, string> = n => (deps => pipe(deps, f3(n < deps.lowerBound)))
