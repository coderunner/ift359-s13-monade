import { flatMap, of as pure, run, State } from "./libs/state.js";

function f(r: string): State<number, string> {
  return (s: number) => [s + 1, r + "; ajout + 1"];
}
function g(r: string): State<number, string> {
  return (s: number) => [s * 2, r + "; multiplication * 2"];
}
const m = pure<number, string>("init");

// Identité gauche : flatMap(pure(x), f) == f(x)
const l1 = flatMap(pure("init"), f);
const eq1 = f("init");
console.log(run(l1, 0), run(eq1, 0)); // [ 1, 'init; ajout + 1' ] [ 1, 'init; ajout + 1' ]

// Identité droite : flatMap(m, pure) == m
const l2 = flatMap(m, pure<number, string>);
const eq2 = m;
console.log(run(l2, 0), run(eq2, 0)); // [ 0, 'init' ] [ 0, 'init' ]

// Associativité : flatMap(flatMap(m, f), g) == flatMap(m, x => flatMap(f(x), g))
const l3 = flatMap(flatMap(m, f), g);
const eq3 = flatMap(m, (x) => flatMap(f(x), g));
console.log(run(l3, 0), run(eq3, 0)); // [ 2, 'init; ajout + 1; multiplication * 2' ] [ 2, 'init; ajout + 1; multiplication * 2' ]
