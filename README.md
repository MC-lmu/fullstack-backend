# Project fullstack - backend

Serveur Express exposant une API REST de gestion de projet pour portfolio.

Le serveur utilise une base de données PostgreSQL pour le stockage.

# Installation

1) Installer les dépendences : `pnpm install`
2) Copier `.env.example` vers `.env.development.local` et remplir le fichier avec les valeurs appropriées
  * La valeur par défaut pour l'URL et le port permettent de se connecter à l'instance locale de PostgreSQL
3) (Optionnel) Initialiser la base de données : `pnpm run initdb`
4) Lancer le serveur : `pnpm run dev`

# Documentation

Seules les routes pour la gestion de projets sont implémentées.

Une route de test, à la racine du serveur (`/`) permet également de tester qu'il fonctionne.

## Routes des projets
Toutes les routes sont préfixées par `/api/v1/projects`.

Un projet est un objet (`Projet`) contenant les champs suivants:
* `id` - ID du projet (interne à la représenation en BDD)
* `title` - Titre du projet (`String`)
* `intro` - Coutre introduction du projet (`String`)
* `description` - Description complètre du projet (`String`)
* `thumbnail_url` - URL de la miniature du projet (`String`)
  * Il est possible de placer des images dans `frontend/public/`, auxquel cas, leur URL sera `/<nomdufichier.png>`.
* `keywords` - Mots-clés associés au projet (`String[]`)
* `illustration_urls` - URL des illustrations du projet (`String[]`)

La structure est identique dans la base de données, aux types près.

* `POST /create`: création d'un projet
  * Accepte un `Projet`
    * Champs obligatoires: `title`, `intro`, `description`, `thumbnail_url`
    * Champs optionnels: `keywords`, `illustration_urls`
    * Champs ignorés: `id`
  * Retourne l'`id` du projet créé

* `GET /`: lecture de la liste des projets
  * Retourne un `Projet[]`
  * Seuls les champs `id`, `title`, `intro`, `keywords`, `thumbnail_url` des `Projet` sont remplis; les autres champs ne sont pas disponibles

* `GET /:id`: lecture des données du projet avec l'ID `id`
  * Retourne un `Projet` (ici, tous les champs remplis)

* `PATCH /:id`: modification du projet avec l'ID `id`
  * Accepte un `Projet`, même partiellement rempli, et met à jour l'entrée en BDD
    * `id` est ignoré
  * ***Ne retourne aucune donnée, seul le code de status indique échec/succès***

* `DELETE /:id`: suppression du projet avec l'ID `id`
  * ***Ne retourne aucune donnée, seul le code de status indique échec/succès***