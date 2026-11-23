/**
 * Task<A> représente la description suspendue d'un calcul asynchrone
 * qui produira une Promise<A> uniquement lors de l'appel à run().
 * Contrairement à Promise<A> (eager), Task<A> est paresseuse (lazy).
 */
export type Task<A> = () => Promise<A>;

/**
 * pure injecte une valeur déjà disponible dans Task
 * sans déclencher d'effet asynchrone.
 */
export function pure<A>(valeur: A): Task<A> {
  return () => Promise.resolve(valeur);
}

/**
 * suspendre encapsule une fonction retournant une Promise
 * afin d'empêcher son démarrage immédiat lors de la déclaration.
 */
export function suspendre<A>(task: () => Promise<A>): Task<A> {
  return task;
}

/**
 * map transforme la valeur future A en B lors de la résolution de la promesse
 */
export function map<A, B>(tache: Task<A>, f: (a: A) => B): Task<B> {
  return () => run(tache).then((a) => f(a));
}

/**
 * flatMap enchaîne deux calculs asynchrones dépendants.
 * Attend la résolution de la première tâche, passe son résultat pour
 * obtenir la seconde tâche, puis déclenche cette seconde tâche.
 */
export function flatMap<A, B>(tache: Task<A>, f: (a: A) => Task<B>): Task<B> {
  return () => run(tache).then((r) => run(f(r)));
}

/**
 * run déclenche l'exécution asynchrone à la frontière du programme.
 */
export function run<A>(tache: Task<A>): Promise<A> {
  return tache();
}
