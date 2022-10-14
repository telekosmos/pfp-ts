import * as R from 'fp-ts/Reader'
import { pipe } from 'fp-ts/function'

type Logger = {
  info: (s: string) => void
}
interface Dependencies {
  logger: { info: (message: string) => void },
  env: 'development' | 'production',
  app: {
    factor: number
  }
}
interface AppDependencies {
  logger: Logger,
  env: 'dev' | 'pro'
}
const logger = { info: (message: string):void => console.log(message) }
const dateLogger: Logger = {
  info: (message: string): void => console.log(`${message} :: ${new Date().toISOString()}`)
}

// STAGE 1
const twice = (n: number): number => n * 2
const stringify = (n: number): string => String(n)
const twicestr = (n: number): string => pipe(
  n,
  twice,
  stringify
)

// STAGE 2 (from the gcanti example)
interface TheDependencies {
  i18n: {
    true: string
    false: string
  }
  lowerBound: number
}
const someDeps: TheDependencies = {
  i18n: {
    true: 'crap',
    false: 'shit' 
  },
  lowerBound: 4
}
// const f = (b: boolean): R.Reader<TheDependencies, string> => deps => (b ? deps.i18n.true : deps.i18n.false)
const f = (b: boolean): R.Reader<TheDependencies, string> => pipe(
  R.ask<TheDependencies>(),
  R.map(deps => (b ? deps.i18n.true : deps.i18n.false))
)
// const g = (n: number): R.Reader<TheDependencies, string> => f(n > 2)
const g = (n: number): R.Reader<TheDependencies, string> => pipe(
  R.ask<TheDependencies>(),
  R.chain(deps => f(n < deps.lowerBound))
)
const h = (s: string): R.Reader<TheDependencies, string> => g(s.length + 1)

const hache = h('shit')(someDeps)
console.log(`hache: ${hache}`)

// STAGE 3 (got it)
const twiceLogger = (n: number, logger: Logger): number => {
  logger.info('SHIT')
  return twice(n)
}
const stringifyLogger = (n: number, logger: Logger): string => {
  logger.info('STRINGIFY')
  return stringify(n)
}

const twiceReader = (n: number): R.Reader<Logger, number> => pipe(
  R.ask<Logger>(),
  R.map(logger => {
    logger.info('XHIT')
    return n * 2
  })
)
const stringifyReader = (n: number): R.Reader<Logger, string> => pipe(
  R.ask<Logger>(),
  R.map(logger => {
    logger.info('KRAP')
    return String(n)
  })
)
const program = (n: number): R.Reader<Logger, string> => pipe(
  n,
  twiceReader,
  R.chain(t => stringifyReader(t))
)
const all = program(3+4)(logger)
console.log(`all ${all}`)

// STAGE 4 (generalized config)
const config: Dependencies = {
  logger: dateLogger,
  env: 'development',
  app: {
    factor: 3
  }
}
const operation = (n: number): R.Reader<Dependencies, number> => pipe(
  R.ask<Dependencies>(),
  R.map(deps => {
    deps.logger.info(`OP: ${deps.app.factor} on ${n}`)
    return n * deps.app.factor
  })
)
const beautify = (n: number): R.Reader<Dependencies, string> => pipe(
  R.ask<Dependencies>(),
  R.map(deps => {
    deps.logger.info(`BEAUTIFY: ${n}`)
    return `Da string: ${n}`
  })
)
const computation = (n: number) => pipe(
  n,
  operation,
  R.chain(opResult => beautify(opResult))
)
const res = computation(7)(config)
console.log(`FULL RESULT: ${res}`)

// query params to object
// ?param1=1&param2=two&param3=3 to
type QueryParams = {
  param1: number
  param2: string
  param3: number
}
