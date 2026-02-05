# Catalogue de Messier

Projet web statique qui affiche le catalogue de Messier avec images locales, filtres, tri et pagination.

## Fonctionnalités
- Tableau des objets Messier (images locales, nom populaire, type, saison, magnitude, constellation, visibilité)
- Filtres : Visible, Saison, Constellation, Type d’objet
- Tri sur chaque colonne (clic sur l’en‑tête)
- Pagination (10 lignes par page)

## Structure
- index.html : structure de la page
- styles.css : styles
- script.js : logique d’affichage, filtres, tri, pagination
- catalogue-data.js : données du catalogue
- messier-names.js : noms populaires
- catalogue_messier/ : images locales (M-001.png … M-110.png)

## Utilisation
Ouvrir index.html dans un navigateur. Aucun serveur requis.

## Notes
- Le filtre "Visible" est activé par défaut.
- Les saisons sont affichées en français uniquement.
