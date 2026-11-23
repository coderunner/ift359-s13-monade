import { flatMap, run, State } from "./libs/state.js";

type Compte = { solde: number };

function compte(id: string, init: number): Compte {
  throw new Error("Function not implemented.");
}

// function deposer(c: Compte, montant: number): [Compte, string] {
//   throw new Error("Function not implemented.");
// }

// function retirer(c: Compte, montant: number): [Compte, string] {
//   throw new Error("Function not implemented.");
// }

// function bloquerCompte(c: Compte, raison: string): [Compte, string] {
//   throw new Error("Function not implemented.");
// }

// const c0 = compte("c-101", 100);
// const [c1, r1] = deposer(c0, 50);
// const [c2, r2] = retirer(c1, 20);
// const [c3, r3] = bloquerCompte(c2, "Suspicion de fraude");
// const [c4, r4] = retirer(c3, 10);

function deposer(montant: number): (c: Compte) => [Compte, string] {
  throw new Error("Function not implemented.");
}

function retirer(montant: number): (c: Compte) => [Compte, string] {
  throw new Error("Function not implemented.");
}

function bloquerCompte(raison: string): (c: Compte) => [Compte, string] {
  throw new Error("Function not implemented.");
}

const scenario: State<Compte, string> = flatMap(deposer(50), () =>
  flatMap(retirer(20), () => flatMap(bloquerCompte("Suspicion de fraude"), () => retirer(10))),
);

const c0 = compte("c-101", 100);
const [compteFinal, dernierResultat] = run(scenario, c0);
