import { flatMap, fromNullable as pure, none, some, Option } from "./libs/option.js";

function f(x: number): Option<number> {
  return x % 2 === 0 ? some(x) : none;
}
function g(x: number): Option<number> {
  return x % 2 !== 0 ? some(x) : none;
}
const m = some(2);

// Identité gauche : flatMap(pure(x), f) == f(x)
const l1 = flatMap(pure(2), f);
const eq1 = f(2);
console.log(l1, eq1); //{ tag: 'Some', valeur: 2 } { tag: 'Some', valeur: 2 }

// Identité droite : flatMap(m, pure) == m
const l2 = flatMap(m, pure);
const eq2 = m;
console.log(l2, eq2); //{ tag: 'Some', valeur: 2 } { tag: 'Some', valeur: 2 }

// Associativité : flatMap(flatMap(m, f), g) == flatMap(m, x => flatMap(f(x), g))
const l3 = flatMap(flatMap(m, f), g);
const eq3 = flatMap(m, (x) => flatMap(f(x), g));
console.log(l3, eq3); //{ tag: 'None' } { tag: 'None' }
