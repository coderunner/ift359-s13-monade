import { assertNever } from "./assert-never.js";
import { none, Option, some } from "./option.js";

export interface Cons<A> {
  readonly tag: "cons";
  readonly tete: A;
  readonly reste: List<A>;
}

export interface Nil {
  readonly tag: "nil";
}

export type List<A> = Cons<A> | Nil;

export const nil: Nil = Object.freeze({ tag: "nil" });

export function cons<A>(tete: A, reste: List<A> = nil): Cons<A> {
  return { tag: "cons", tete, reste };
}

export function estVide<A>(l: List<A>): l is Nil {
  return l.tag === "nil";
}

export function estCons<A>(l: List<A>): l is Cons<A> {
  return l.tag === "cons";
}

export function tete<A>(l: List<A>): Option<A> {
  switch (l.tag) {
    case "nil":
      return none;
    case "cons":
      return some(l.tete);
    default:
      assertNever(l);
  }
}

export function reste<A>(l: List<A>): List<A> {
  switch (l.tag) {
    case "nil":
      return nil;
    case "cons":
      return l.reste;
    default:
      assertNever(l);
  }
}

export function longueur<A>(l: List<A>): number {
  function iter(courante: List<A>, acc: number): number {
    switch (courante.tag) {
      case "nil":
        return acc;
      case "cons":
        return iter(courante.reste, acc + 1);
      default: {
        assertNever(courante);
      }
    }
  }
  return iter(l, 0);
}

export function trouver<A>(l: List<A>, p: (a: A) => boolean): Option<A> {
  switch (l.tag) {
    case "nil":
      return none;
    case "cons": {
      if (p(l.tete)) return some(l.tete);
      return trouver(l.reste, p);
    }
    default: {
      assertNever(l);
    }
  }
}

export function concat<A>(l1: List<A>, l2: List<A>): List<A> {
  switch (l1.tag) {
    case "nil":
      return l2;
    case "cons":
      return cons(l1.tete, concat(l1.reste, l2));
    default:
      return assertNever(l1);
  }
}

export function map<A, B>(l: List<A>, f: (a: A) => B): List<B> {
  switch (l.tag) {
    case "nil":
      return nil;
    case "cons":
      return cons(f(l.tete), map(l.reste, f));
    default:
      return assertNever(l);
  }
}

export function flatMap<A, B>(l: List<A>, f: (a: A) => List<B>): List<B> {
  switch (l.tag) {
    case "nil":
      return nil;
    case "cons":
      return concat(f(l.tete), flatMap(l.reste, f));
    default:
      return assertNever(l);
  }
}

export function fold<A, R>(l: List<A>, initial: R, combiner: (acc: R, val: A) => R): R {
  switch (l.tag) {
    case "nil":
      return initial;
    case "cons":
      return fold(l.reste, combiner(initial, l.tete), combiner);
    default:
      return assertNever(l);
  }
}
