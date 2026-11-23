/**
 * IO<A> représente la description suspendue d'un calcul synchrone
 * qui peut produire des effets de bord et qui retourne une valeur de type A.
 * Aucun effet n'est déclenché avant l'appel à run().
 */
export type IO<A> = () => A;

/**
 * pure injecte une valeur déjà calculée dans IO.
 */
export function pure<A>(valeur: A): IO<A> {
  return () => valeur;
}

/**
 * suspendre capture un effet de bord impur.
 */
export function suspendre<A>(effet: () => A): IO<A> {
  return effet;
}

/**
 * map transforme le résultat futur A en B (sans exécuter immédiatement).
 */
export function map<A, B>(action: IO<A>, f: (a: A) => B): IO<B> {
  return () => f(run(action));
}

/**
 * flatMap ordonne strictement deux actions avec effets dans le temps.
 * L'action 1 s'exécute et son résultat est transmis à f pour construire
 * l'action 2, qui s'exécute ensuite — suspendu jusqu'à l'appel de .run().
 * Ça rappelle la monade d'état !
 */
export function flatMap<A, B>(action: IO<A>, f: (a: A) => IO<B>): IO<B> {
  return () => {
    const resultatA = run(action);
    const prochaineAction = f(resultatA);
    return run(prochaineAction);
  };
}

/**
 * run déclenche l'exécution réelle.
 */
export function run<A>(action: IO<A>): A {
  return action();
}
