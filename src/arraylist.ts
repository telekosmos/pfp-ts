import { Functor1 } from 'fp-ts/Functor'

export type ArrayList<A> = Array<A>
export const URI = 'ArrayList'
export type URI = typeof URI // type URI = 'Tree' (literal type)


declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly ArrayList: ArrayList<A>
  }
}

export const Functor: Functor1<URI> = {
  URI,
  map: (as, f) => {
    return as.length === 0
      ? []
      : [f(as[0])].concat(Functor.map(as.slice(1), f))
  }
}

const al = [1, 2, 3, 4]
const mapl = Functor.map(al, v => v - 1);
mapl
