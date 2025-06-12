# Mega Factory - Documentation

## Vue d'ensemble

Le Mega Factory est une extension du calculateur interactif Satisfactory qui fournit une conception d'usine optimisée pour l'endgame, couvrant toute la carte et capable de produire tous les objets nécessaires pour la Phase 5 de l'Ascenseur Spatial.

## Fonctionnalités

### 1. Conception Optimisée
- **Couverture complète de la carte** : Utilise tous les nœuds de ressources disponibles
- **Production endgame** : Capable de produire les 4 objets requis pour la Phase 5
- **Recettes alternatives** : Utilise les chaînes de production les plus efficaces
- **Infrastructure complète** : Alimentation, transport et logistique

### 2. Visualisation Interactive
- **Zones de production** : 5 zones spécialisées réparties sur la carte
- **Réseau de transport** : Trains à grande vitesse et hypertubes express
- **Flux de production** : Indicateurs visuels des flux de ressources
- **Statistiques en temps réel** : Calculs de production et d'efficacité

### 3. Export et Génération
- **Export de conception** : Sauvegarde la configuration au format JSON
- **Génération de sauvegarde** : Crée directement une sauvegarde Satisfactory (en développement)

## Architecture

### Fichiers Principaux

1. **MegaFactoryDesign.js** : Logique de conception et calculs
2. **MegaFactoryVisualizer.js** : Rendu sur la carte interactive
3. **Modal/Map/MegaFactory.js** : Interface utilisateur
4. **SaveGenerator.js** : Génération de sauvegardes (expérimental)

### Zones de Production

#### Northwest - Complexe Industriel du Nord-Ouest
- **Ressources principales** : Calcaire, Minerai de fer
- **Production** : Béton, Plaques de fer, Tiges de fer, Vis
- **Rôle** : Base de production des matériaux de construction

#### Northeast - District Fer & Énergie du Nord-Est
- **Ressources principales** : Minerai de fer, Charbon, Soufre
- **Production** : Acier, Génération d'énergie, Poudre noire
- **Rôle** : Hub de production d'acier et de génération d'énergie au charbon

#### Central - Mégaplexe d'Assemblage Central
- **Ressources principales** : Bauxite, Minerai de Caterium
- **Production** : Aluminium, Superordinateurs, Composants avancés
- **Rôle** : Assemblage de composants avancés et traitement de l'aluminium

#### Southwest - Complexe Pétrochimique du Sud-Ouest
- **Ressources principales** : Pétrole brut, Minerai de cuivre
- **Production** : Plastique, Caoutchouc, Carburant, Produits pétrochimiques
- **Rôle** : Raffinage du pétrole et production de polymères

#### Southeast - Complexe Nucléaire & Spatial du Sud-Est
- **Ressources principales** : Uranium, Quartz brut
- **Production** : Énergie nucléaire, Objets endgame, Technologie quantique
- **Rôle** : Énergie nucléaire et production d'objets endgame

## Spécifications Techniques

### Production Endgame (Requis pour Phase 5)
- **Assembly Director System** : 4 000 unités
- **Magnetic Field Generator** : 4 000 unités
- **Nuclear Pasta** : 1 000 unités
- **Thermal Propulsion Rocket** : 1 000 unités

### Extraction de Ressources Totale
- **Calcaire** : 11 640/min (94 nœuds)
- **Minerai de fer** : 15 240/min (127 nœuds)
- **Minerai de cuivre** : 6 600/min (55 nœuds)
- **Minerai de Caterium** : 3 000/min (17 nœuds)
- **Charbon** : 7 440/min (62 nœuds)
- **Pétrole brut** : 3 600/min (30 nœuds)
- **Soufre** : 1 920/min (16 nœuds)
- **Bauxite** : 2 040/min (17 nœuds)
- **Quartz brut** : 2 040/min (17 nœuds)
- **Uranium** : 600/min (5 nœuds)
- **SAM** : 2 280/min (19 nœuds)

### Infrastructure Énergétique
- **Capacité totale** : 340 GW
- **Nucléaire** : 300 GW (120 réacteurs)
- **Carburant** : 30 GW (100 générateurs)
- **Géothermique** : 10 GW (tous les nœuds)

### Réseau de Transport
- **Trains** : 25 stations avec réseau complet inter-zones
- **Hypertubes** : Couverture complète avec routes express
- **Convoyeurs** : Courroies Mk.5 pour les artères principales
- **Pipelines** : Tuyaux Mk.2 pour tout le transport de fluides

## Utilisation

### Activation
1. Charger une sauvegarde dans l'Interactive Map
2. Ouvrir le menu "Statistics" 
3. Cliquer sur l'onglet "Mega Factory"
4. Activer "Show Mega Factory Visualization"

### Export
1. Cliquer sur "Export Design" pour sauvegarder la configuration
2. Le fichier JSON contient toutes les spécifications de la conception

## Recettes Alternatives Optimales

### Production d'Acier
- **Solid Steel Ingot** : +50% de rendement en acier
- **Pure Iron Ingot** : Efficacité maximale du minerai de fer
- **Compacted Coal** : Optimisation du charbon

### Traitement du Pétrole
- **Heavy Oil Residue + Diluted Fuel** : Ratio de conversion 4.5x
- **Recycled Plastic** : Triple la production de plastique
- **Recycled Rubber** : Efficacité maximale du caoutchouc

### Énergie Nucléaire
- **Uranium Fuel Unit** : 340 GW sans déchets d'uranium
- **Infused Uranium Cell** : Efficacité maximale

## Ordre de Construction Recommandé

### Phase 1 : Fondations & Énergie
- Établir l'alimentation au charbon dans le Nord-Est (30 GW)
- Configurer la production de base de fer et cuivre
- Construire la production initiale de béton dans le Nord-Ouest

### Phase 2 : Acier & Pétrole
- Implémenter la chaîne de production Solid Steel Ingot
- Configurer le traitement du pétrole dans le Sud-Ouest
- Établir la génération d'énergie au carburant (30 GW)

### Phase 3 : Production Avancée
- Construire le traitement de l'aluminium dans la zone Centrale
- Configurer la production d'ordinateurs et de cadres modulaires lourds
- Implémenter les chaînes de recettes alternatives optimales

### Phase 4 : Nucléaire & Transport
- Construire l'infrastructure d'énergie nucléaire (300 GW)
- Compléter le réseau ferroviaire entre toutes les zones
- Configurer la chaîne de traitement de l'uranium

### Phase 5 : Production Endgame
- Construire les lignes de production Assembly Director System
- Configurer les usines Magnetic Field Generator
- Implémenter la production Nuclear Pasta
- Créer l'assemblage Thermal Propulsion Rocket

## Notes Techniques

### Compatibilité
- Compatible avec Satisfactory Update 1.0+
- Fonctionne avec les sauvegardes créatives et de survie
- Supporte les configurations moddées (avec limitations)

### Performance
- Optimisé pour les calculs en temps réel
- Mise en cache des données de production
- Rendu efficace des visualisations

### Limitations
- Génération de sauvegarde en développement
- Positions exactes des nœuds approximatives
- Nécessite validation manuelle des recettes

## Contributions

Ce module fait partie du projet SC-InteractiveMap. Pour signaler des bugs ou suggérer des améliorations, veuillez utiliser le système d'issues du projet principal.