import { flatMap, Result } from "./libs/result.js";
type Erreur = { code: number };
type Reponse = { rep: string };

// function validerUrl(url: string): URL {
//   return null as unknown as URL;
// }

// function envoyerRequete(url: URL): Reponse | Erreur {
//   return null as unknown as Reponse;
// }

// function decoderJson(reponse: Reponse): JSON {
//   return null as unknown as JSON;
// }

// function get(url: string): JSON {
//   try {
//     const urlValide = validerUrl(url); // peut lancer UrlInvalideError
//     const rep = envoyerRequete(urlValide); // peut lancer ReseauError
//     if ("code" in rep) {
//       console.error("Error HTTP :", rep.code);
//       throw new Error("Boom");
//     }

//     return decoderJson(rep); // peut lancer JsonError
//   } catch (e) {
//     console.error("Quelque chose a échoué :", e);
//     throw e;
//   }
// }

function validerUrl(url: string): Result<Erreur, URL> {
  return null as unknown as Result<Erreur, URL>;
}

function envoyerRequete(url: URL): Result<Erreur, Reponse> {
  return null as unknown as Result<Erreur, Reponse>;
}

function decoderJson(reponse: Reponse): Result<Erreur, JSON> {
  return null as unknown as Result<Erreur, JSON>;
}

function get(url: string): Result<Erreur, JSON> {
  const valideUrl = validerUrl(url);
  const reponse = flatMap(valideUrl, (url) => envoyerRequete(url));
  return flatMap(reponse, (r) => decoderJson(r));
}
