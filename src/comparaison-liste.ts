import { cons, estCons, flatMap, fold, List, map, nil } from "./libs/list.js";

const couleurs = cons("rouge", cons("jaune", nil));
const tailles = cons("petit", cons("medium", cons("large", nil)));

// function combiner(cs: List<string>, ts: List<string>): string[] {
//   let resultat = [];

//   for (let l1 = cs; estCons(l1); l1 = l1.reste) {
//     for (let l2 = ts; estCons(l2); l2 = l2.reste) {
//       resultat.push(`${l1.tete}-${l2.tete}`);
//     }
//   }
//   return resultat;
// }

// console.log(combiner(couleurs, tailles));

function combiner(cs: List<string>, ts: List<string>): string[] {
  return fold(
    flatMap(cs, (c) => map(ts, (t) => `${c}-${t}`)),
    [],
    (acc: string[], s: string) => [...acc, s],
  );
}

console.log(combiner(couleurs, tailles));
