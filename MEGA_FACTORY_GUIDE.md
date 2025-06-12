# 🏭 Guide d'utilisation - Générateur d'Usine Optimisée

## 📋 Vue d'ensemble

Cette fonctionnalité ajoute un bouton **"🏭 Mega Factory"** à l'interface de la carte interactive qui permet de générer automatiquement une usine complète optimisée directement dans votre sauvegarde Satisfactory.

## ✨ Fonctionnalités

### ✅ **Génération Automatique**
- **Bâtiments de production** : Constructors, Assemblers, Manufacturers, etc.
- **Fondations** : Placement automatique sur grille 1m x 1m
- **Systèmes de transport** : Convoyeurs, tuyaux, hypertubes
- **Réseau électrique** : Connexions automatiques
- **Zéro perte** : Production parfaitement équilibrée pour Phase 5

### ✅ **Optimisation Endgame**
- **Phase 5 Space Elevator** : Tous les besoins couverts
- **5 zones spécialisées** : Northwest, Northeast, Central, Southwest, Southeast
- **Production calculée** : Assembly Director System, Magnetic Field Generator, Nuclear Pasta, Thermal Propulsion Rocket

## 🚀 Comment utiliser

### 1. **Démarrer l'éditeur de sauvegarde**
```bash
npm start
```

### 2. **Charger une sauvegarde**
- Glissez-déposez votre fichier `.sav` sur l'interface
- Ou utilisez le bouton "Choose Save File"

### 3. **Accéder au Mega Factory**
- Cliquez sur le bouton **"🏭 Mega Factory"** dans la barre de navigation
- Le modal s'ouvre avec les options de visualisation et génération

### 4. **Générer l'usine optimisée**
- Cliquez sur **"🏭 Générer Usine Optimisée"**
- Confirmez la génération dans la popup d'avertissement
- Suivez le progrès dans la modal de génération

### 5. **Résultat**
- L'usine est automatiquement ajoutée à votre sauvegarde
- Téléchargez le fichier modifié
- Chargez-le dans Satisfactory pour voir votre nouvelle usine !

## 🔧 Architecture technique

### Fichiers principaux
- **`/src/Modal/Map/MegaFactory.js`** - Interface utilisateur et gestion des événements
- **`/src/Spawn/OptimizedFactory.js`** - Générateur automatique d'usine
- **`/src/MegaFactory/MegaFactoryDesign.js`** - Design et calculs de production
- **`/src/MegaFactory/MegaFactoryVisualizer.js`** - Visualisation sur carte

### Intégration
- **Bouton navigation** : Ajouté dans `index.html`
- **Gestionnaire d'événements** : Intégré dans `BaseLayout.js`
- **Modal système** : Utilise `BaseLayout_Modal.js`

## 📊 Spécifications de l'usine générée

### Zones de production
1. **Northwest** : Concrete & Basic Materials (2048 fondations)
2. **Northeast** : Steel & Power (3072 fondations) 
3. **Central** : Advanced Assembly (4096 fondations)
4. **Southwest** : Oil & Petrochemicals (2560 fondations)
5. **Southeast** : Nuclear & Endgame (3584 fondations)

### Production ciblée
- **Assembly Director System** : 40/min
- **Magnetic Field Generator** : 40/min  
- **Nuclear Pasta** : 20/min
- **Thermal Propulsion Rocket** : 20/min

### Infrastructure
- **Total fondations** : 15,360 (8m x 4m)
- **Bâtiments** : ~500 machines de production
- **Transport** : Réseau complet de convoyeurs Mk1-Mk5
- **Puissance** : 340 GW (Coal + Fuel + Nuclear)

## 🔍 Dépannage

### Le bouton n'apparaît pas
- Vérifiez qu'un fichier de sauvegarde est chargé
- Rafraîchissez la page et rechargez la sauvegarde

### Erreur de génération
- Utilisez une sauvegarde "propre" avec peu de bâtiments existants
- Vérifiez que la sauvegarde n'est pas corrompue
- Consultez la console pour les détails d'erreur

### Performance
- La génération peut prendre 30-60 secondes
- Ne fermez pas l'onglet pendant la génération
- Un message de confirmation apparaîtra à la fin

## 🎯 Prochaines améliorations possibles

- [ ] **Placement intelligent** : Éviter les collisions avec bâtiments existants
- [ ] **Recettes alternatives** : Support des recettes optimales
- [ ] **Transport avancé** : Trains et hypertubes détaillés
- [ ] **Zones personnalisables** : Permettre la modification des zones
- [ ] **Import/Export** : Sauvegarder et charger des designs

## 📝 Notes techniques

### Système de coordonnées
- **Grille** : 100 unités Unreal = 1 mètre
- **Fondations** : 800 unités = 8m x 8m
- **Placement** : Alignement automatique sur grille

### Format de sauvegarde
- Compatible avec Satisfactory Update 1.0+
- Respecte le format binaire officiel
- Génère des pathNames uniques pour éviter les conflits

### Performance
- **Génération asynchrone** : N'interrompt pas l'interface
- **Callbacks de progrès** : Feedback temps réel
- **Nettoyage automatique** : Gestion mémoire optimisée

---

*Cette fonctionnalité transforme votre éditeur de sauvegarde en un puissant outil de planification d'usine pour Satisfactory !* 🚀