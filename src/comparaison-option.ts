import { flatMap, map, Option } from "./libs/option.js";

type Utilisateur = { profilId: any };
type Profil = { ville: string };

// function trouverUtilisateur(id: string): Utilisateur | null {
//   return null as unknown as Utilisateur;
// }

// function trouverProfil(id: string): Profil | null {
//   return null as unknown as Profil;
// }

// function villeDeLUtilisateur(id: string): string | null {
//   const utilisateur = trouverUtilisateur(id);
//   if (utilisateur === null) return null;

//   const profil = trouverProfil(utilisateur.profilId);
//   if (profil === null) return null;

//   return profil.ville;
// }

function trouverUtilisateur(id: string): Option<Utilisateur> {
  return null as unknown as Option<Utilisateur>;
}

function trouverProfil(id: string): Option<Profil> {
  return null as unknown as Option<Profil>;
}

function villeDeLUtilisateur(id: string): Option<string> {
  const utilisateur = trouverUtilisateur(id);
  const profil = flatMap(utilisateur, (u) => trouverProfil(u.profilId));
  return map(profil, (p) => p.ville);
}
