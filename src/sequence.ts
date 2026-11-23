import * as Opt from "./libs/option.js";
import * as Res from "./libs/result.js";
import * as State from "./libs/state.js";
import * as IO from "./libs/io.js";

// Option<A> : Option<A>[] -> Option<A[]>
// (Tout réussit -> Some([...]) ; au moins un None -> None)
export function sequenceOption<A>(liste: Opt.Option<A>[]): Opt.Option<A[]> {
  return liste.reduce<Opt.Option<A[]>>(
    (acc, courant) => Opt.flatMap(acc, (vals) => Opt.map(courant, (v) => [...vals, v])),
    Opt.some([]),
  );
}

// Result<E, A> : Result<E, A>[] -> Result<E, A[]>
// (Tout réussit -> value([...]) ; premier Erreur -> court-circuit avec Erreur)
export function sequenceResult<E, A>(liste: Res.Result<E, A>[]): Res.Result<E, A[]> {
  return liste.reduce<Res.Result<E, A[]>>(
    (acc, courant) => Res.flatMap(acc, (vals) => Res.map(courant, (v) => [...vals, v])),
    Res.value([]),
  );
}

// State<S, A> : State<S, A>[] -> State<S, A[]>
// (Fait transiter l'état S d'une action à l'autre et accumule les résultats)
export function sequenceState<S, A>(liste: State.State<S, A>[]): State.State<S, A[]> {
  return liste.reduce<State.State<S, A[]>>(
    (acc, courant) => State.flatMap(acc, (vals) => State.map(courant, (v) => [...vals, v])),
    State.of([]),
  );
}

// IO<A> : IO<A>[] -> IO<A[]>
// (Assemble une recette synchrone qui exécute les actions dans l'ordre et accumule les sorties)
export function sequenceIO<A>(liste: IO.IO<A>[]): IO.IO<A[]> {
  return liste.reduce<IO.IO<A[]>>(
    (acc, courant) => IO.flatMap(acc, (vals) => IO.map(courant, (v) => [...vals, v])),
    IO.pure([]),
  );
}

// interface Monade<M<_>> {
//   readonly pure: <A>(valeur: A) => M<A>;
//   readonly map: <A, B>(ma: M<A>, f: (a: A) => B) => M<B>;
//   readonly flatMap: <A, B>(ma: M<A>, f: (a: A) => M<B>) => M<B>;
// }

// // Transforme un tableau de boîtes M<A>[] en une boîte de tableau M<A[]>
// function sequence<M<_>, A>(
//   M: Monade<M>,
//   liste:  M<A>[]
// ): M< A[]> {
//   return liste.reduce(
//     (acc, courant) =>
//       M.flatMap(acc, (vals) => M.map(courant, (v) => [...vals, v])),
//     M.pure([])
//   );
// }
