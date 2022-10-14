import { Functor1 } from 'fp-ts/Functor'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'

/*
export type Tree<A> = {
  readonly left: O.Option<Tree<A>>
  readonly data: A
  readonly right: O.Option<Tree<A>>
}
*/
// export type ArrayList<A> = Array<A>
export const URI = 'Set'
export type URI = typeof URI // type URI = 'Tree' (literal type)


declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly Set: Set<A>
  }
}

export const Functor: Functor1<URI> = {
  URI,
  map: (as, f) => new Set(Array.from(as).map(f))
}

