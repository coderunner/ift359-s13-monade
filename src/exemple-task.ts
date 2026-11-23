import { Option, fromNullable, map as mapOpt, matchOption } from "./libs/option.js";
import { Result, map as mapRes, flatMap as flatMapRes, value, error, matchResult } from "./libs/result.js";
import { flatMap, map, pure, run, suspendre, Task } from "./libs/task.js";
import { IO, suspendre as suspendreIO, run as runIO } from "./libs/io.js";

// Primitives asynchrones en attente
function recupererIdUtilisateur(nom: string): Task<number> {
  return suspendre(() => {
    console.log(`[Réseau] Recherche de l'ID pour ${nom}...`);
    return Promise.resolve(42);
  });
}

function recupererRole(userId: number): Task<string> {
  return suspendre(() => {
    console.log(`[Réseau] Chargement du rôle pour l'ID ${userId}...`);
    return Promise.resolve("Admin");
  });
}

// Assemblage
const tacheId = recupererIdUtilisateur("Alice");
const tacheRole = flatMap(tacheId, (id) => recupererRole(id));
const prog: Task<string> = map(tacheRole, (role) => `Rôle trouvé : ${role}`);

console.log("Programme assemblé");

// Déclenchement des actions
const res = await run(prog);
console.log("Résultat", res);

// ---
/**
 * Capture toute promesse susceptible d'échouer et la convertit en Task<Result<E, A>>.
 */
export function essayerAsync<E, A>(tache: Task<A>, surErreur: (err: unknown) => E): Task<Result<E, A>> {
  return () =>
    tache()
      .then((valeur) => value<A, E>(valeur))
      .catch((raison) => error<E, A>(surErreur(raison)));
}

type ErreurHttp =
  | { readonly code: "ErreurReseau"; readonly message: string }
  | { readonly code: "ErreurStatut"; readonly statut: number }
  | { readonly code: "ErreurJson"; readonly message: string };

interface CryptoTicker {
  readonly symbol: string;
  readonly price_usd: string;
}

interface ReponseCoinLore {
  readonly data: readonly CryptoTicker[];
}

function recupererTickers(url: string): Task<Result<ErreurHttp, ReponseCoinLore>> {
  return flatMap(
    essayerAsync<ErreurHttp, Response>(
      suspendre(() => fetch(url)),
      (e) => ({ code: "ErreurReseau" as const, message: String(e) }),
    ),
    (resHttp: Result<ErreurHttp, Response>) => {
      const reponseValidee = flatMapRes(resHttp, (reponse) =>
        !reponse.ok ? error({ code: "ErreurStatut", statut: reponse.status }) : value(reponse),
      );
      return matchResult(
        reponseValidee,
        (erreur: ErreurHttp) => {
          return pure(error(erreur));
        },
        (reponse) => {
          return essayerAsync(
            () => reponse.json() as Promise<ReponseCoinLore>,
            (e) => ({ code: "ErreurJson" as const, message: String(e) }),
          );
        },
      );
    },
  );
}

// Fonction pure sans monade
function trouverPrixSymbole(reponse: ReponseCoinLore, symbole: string): Option<number> {
  const trouve = reponse.data.find((c) => c.symbol === symbole.toUpperCase());
  return mapOpt(fromNullable(trouve), (crypto) => Number(crypto.price_usd));
}

// Construction du pipeline d'exécution en chaînant Task et fonctions pures
const programme = map(recupererTickers("https://api.coinlore.net/api/tickers/"), (result) =>
  mapRes(result, (response: ReponseCoinLore) => trouverPrixSymbole(response, "BTC")),
);

console.log("Construction du programme terminée");

function log(s: string): IO<void> {
  return suspendreIO(() => console.log(s));
}
function formatResultat(r: Result<ErreurHttp, Option<number>>): string {
  return matchResult(
    r,
    (e) => {
      return `Erreur HTTP (${e.code}) : ${"statut" in e ? e.statut : e.message}`;
    },
    (prixOpt) => {
      return matchOption(
        prixOpt,
        () => "Symbole introuvable dans la liste CoinLore",
        (prix) => `Prix actuel du Bitcoin : ${prix} $ USD`,
      );
    },
  );
}

// Rien ne s'exécute avant l'appel à run()
runIO(await run(programme).then((response) => log(formatResultat(response))));
