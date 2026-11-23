fetch("https://superapi/users/1")
  .then((rep) => rep.json()) // flatMap
  .then((user) => fetch(`https://superapi/posts?userId=${user.id}`)) // flatMap
  .then((repPosts) => repPosts.json()) // flatMap
  .then((posts) => posts.length) // map
  .then((nbPosts) => console.log("Nombre d'articles :", nbPosts)) // succès
  .catch((err) => console.error("Erreur réseau :", err.message)) // erreur
  .finally(() => {
    console.log("Requête terminée."); // toujours exécuté
  });
