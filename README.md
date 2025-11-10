🚕 Taxi-app : Simulateur de Réservation de Taxi – Casablanca
📖 Description

Cette application est un simulateur de réservation de petits taxis rouges à Casablanca.
Elle permet aux utilisateurs d’expérimenter une simulation réaliste et interactive de commande de taxi avec carte dynamique, estimation du prix et trajet simulé selon les tarifs réels de Casablanca.

✨ Fonctionnalités principales

🗺️ Carte interactive : visualisation du taxi, du point de départ et de la destination.

🚖 Simulation de course : animation du déplacement virtuel du taxi entre deux points.

💰 Calcul automatique du tarif : basé sur les tarifs réels de Casablanca (prise en charge, distance, attente).

📍 Sélection des lieux : choix du point de départ et d’arrivée via la carte ou un champ de recherche.

🧭 Interface moderne et fluide, simple à utiliser.

🔒 Mode hors ligne complet, aucune API payante ni connexion externe requise.

🧱 Objectif du projet

Le but de ce projet est de reproduire l’expérience d’une application de réservation de taxi dans un cadre 100 % éducatif et expérimental.
Ce simulateur sert à :

Comprendre la logique d’un service de transport urbain.

Expérimenter la manipulation de cartes, animations et calculs de distance.

Mettre en pratique la gestion d’état et la simulation de données.

📄 Pages à développer
Page Description
🏠 SplashScreen Écran d’introduction avec le logo et transition vers la page principale.
🚗 Accueil (Index) Affiche la carte interactive avec la possibilité de choisir le départ et la destination.
📍 Sélection de lieu Permet à l’utilisateur de sélectionner un point sur la carte ou via un champ de recherche.
🧾 Détails de la course Montre la distance, le temps estimé et le tarif calculé avant de lancer la simulation.
🛣️ Simulation du trajet Animation du taxi suivant le trajet sur la carte.
📸 Galerie (optionnelle) Affiche des photos et informations sur les taxis rouges de Casablanca.
⚙️ À propos / Paramètres Informations sur les tarifs, le mode simulation et le projet.

📂 Structure du projet

📦 taxi-app
│
├── 📁 assets
│ ├── images/ # Images et icônes (logo, taxis, carte, etc.)
│ └── fonts/ # Polices personnalisées (si utilisées)
│
├── 📁 components
│ ├── TaxiMarker.tsx # Composant affichant le taxi sur la carte
│ ├── PriceCalculator.ts # Calcul du prix selon distance et tarif
│ ├── CustomButton.tsx # Boutons réutilisables
│ ├──SplashScreen.tsx # Écran d’introduction
└── MapControls.tsx # Contrôles d’interaction avec la carte
│
├── 📁 app
│ ├── layout.tsx
│ ├── indexScreen.tsx # Carte interactive et sélection du départ/destination
│ ├── DetailsScreen.tsx # Détails de la course (distance, prix, temps)
│ ├── SimulationScreen.tsx # Animation du taxi en mouvement
│ ├── GalleryScreen.tsx # (Optionnel) Galerie d’images
│ └──
│
├── 📁 store
│ └── useTaxiStore.ts # Gestion d’état avec Zustand ou Redux
│
├── 📁 utils
│ ├── distance.ts # Calcul de distance entre deux points
│ ├── formatPrice.ts # Formatage du prix
│ └── constants.ts # Tarifs et configurations globales  
 ├── package.json # Dépendances et scripts
└── README.md # Documentation

Voici une structure recommandée pour ton application :

🚀 Installation et exécution

# Accéder au dossier

cd taxi-app

# Installer les dépendances

npm install

# Lancer l’application

npm start

🧠 Auteur
👨‍💻 Youness Hafa
