import { flatMap, IO, pure, run, suspendre } from "./libs/io.js";

// MONDE PUR
// Création des instances de monade.
const ecrireLigne = (message: string): IO<void> => suspendre(() => console.log(message));
const lireTimestamp = (): IO<number> => suspendre(() => Date.now());
const aleatoire = (): IO<number> => suspendre(() => Math.random());

function genererCodeSession(timestamp: number, seed: number): string {
  const suffixe = Math.floor(seed * 10000)
    .toString()
    .padStart(4, "0");
  return `SES-${timestamp}-${suffixe}`;
}

// Création du programme (recette)
// Ce programme est une donnée.
const programme: IO<string> = flatMap(ecrireLigne("Départ"), () =>
  flatMap(lireTimestamp(), (timestamp) =>
    flatMap(aleatoire(), (nbAleatoire) => {
      const sessionId = genererCodeSession(timestamp, nbAleatoire);
      return flatMap(ecrireLigne(`Session ${sessionId}`), () => pure("Fin"));
    }),
  ),
);

// MONDE IMPUR
console.log("Avant execution");
const rapport = run(programme);
console.log("Résultat retourné :", rapport);
// Avant execution
// Départ
// Session SES-1795453007350-5264
// Résultat retourné : Fin
