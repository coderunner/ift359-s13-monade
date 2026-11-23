import { cons, estVide, List, nil } from "./libs/list.js";
import { matchOption, some } from "./libs/option.js";
import { error, Result, value } from "./libs/result.js";

function ajouter(a: number, b: number): number {
  return a + b;
}
function multiplier(a: number, b: number): number {
  return a * b;
}
function afficher(a: number) {
  console.log(a);
}
const r1 = ajouter(2, 3);
const r2 = multiplier(r1, 2);
afficher(r2);

function ajouterCPS(a: number, b: number, k: (r: number) => void): void {
  k(a + b);
}
function multiplierCPS(a: number, b: number, k: (r: number) => void): void {
  k(a * b);
}

ajouterCPS(2, 3, (res) => multiplierCPS(res, 2, (res) => afficher(res))); // 10

[1, 2, 3, 4, 5].map((v) => v + 2);

export function trouver<A, R>(l: List<A>, p: (a: A) => boolean, surTrouve: (a: A) => R, surEchec: () => R): R {
  switch (l.tag) {
    case "nil":
      return surEchec();
    case "cons": {
      if (p(l.tete)) return surTrouve(l.tete);
      return trouver(l.reste, p, surTrouve, surEchec);
    }
  }
}

const l = cons(1, cons(2, cons(3, cons(4, nil))));

const r: Result<string, number> = trouver(
  l,
  (a) => a === 2,
  (a) => value(a),
  () => error("non trouvé!"),
);

const opt = some(2);

const s = matchOption(
  opt,
  () => "valeur: inconnue",
  (v) => "valeur: " + String(v),
);

console.log(s);
