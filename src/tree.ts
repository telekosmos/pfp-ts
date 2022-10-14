import { Functor1 } from 'fp-ts/Functor'
import * as O from 'fp-ts/Option'
/*
type Branch<A> = Tree<A> | null
export type Tree<A> = {
  readonly left: O.Option<Tree<A>>
  readonly data: A
  readonly right: O.Option<Tree<A>>
}
*/

type XEmpty = { [K in symbol]: never }
type Empty = { _type: 'empty' };
type Data<A> = A
type Node<A> = { _type: 'node', value: Data<A>, left: XTree<A>, right: XTree<A> }
// type XTree<A> = ND | Data<A> | Branch<A>
type Tree<A> = Empty | Node<A>

const notree: Tree<number> = { _type: 'empty'}
const xtree: Tree<number> = {
  _type: 'node',
  value: 3, 
  left: {
    _type: 'node',
    value: 2,
    left: { _type: 'empty' },
    right: { _type: 'empty' }
  },
  right: {
    _type: 'node',
    value: 5,
    left: {
      _type: 'node',
      value: 4,
      left: { _type: 'empty' },
      right: { _type: 'empty' }
    },
    right: { _type: 'empty' }
  }
};

export const URI = 'Tree'
export type URI = typeof URI // type URI = 'Tree' (literal type)

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly Tree: Tree<A>
  }
}

export const Functor: Functor1<URI> = {
  URI,
  map: <A, B>(fa: Tree<A>, f: (a: A) => B): Tree<B> => {
    switch (fa._type) {
      case 'empty':
        return fa

      case 'node':
        return {
          _type: fa._type,
          value: f(fa.value),
          left: Functor.map(fa.left, f),
          right: Functor.map(fa.right, f)
        }

      default:
        return fa;
    }
  }
}

// const mapped: Tree<number> = Functor.map(xtree, v => v * 3);

