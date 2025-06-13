/* global L */

import Modal_Statistics_Production from './Production.js';

export default class Modal_Statistics_FactoryGenerator extends Modal_Statistics_Production
{
    constructor(options)
    {
        super(options);
        this.factoryGeneratorSettings = {
            gridSize: 800,
            verticalSpacing: 400,
            targetProduction: {},
            optimizationMode: 'endgame'
        };
    }

    showModal()
    {
        return new Promise((resolve) => {
            let html = this.getFactoryGeneratorHTML();
            
            $('#genericModal .modal-content').html(html);
            $('#genericModal').modal('show').off('hidden.bs.modal').on('hidden.bs.modal', () => {
                resolve(true);
            });
            
            this.attachFactoryGeneratorEvents();
        });
    }

    getFactoryGeneratorHTML()
    {
        let html = `
            <div class="modal-header">
                <h4 class="modal-title">
                    <i class="fas fa-industry"></i> Générateur d'usine optimisée
                </h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12">
                        <p class="text-muted">
                            Ce générateur crée automatiquement une usine complète optimisée pour la production en end-game.
                        </p>
                        
                        <div class="form-group mb-3">
                            <label class="form-label">Mode d'optimisation</label>
                            <select class="form-select" id="optimizationMode">
                                <option value="endgame">End-game (Production maximale)</option>
                                <option value="balanced">Équilibré (Production modérée)</option>
                                <option value="starter">Démarrage rapide</option>
                            </select>
                        </div>
                        
                        <div class="form-group mb-3">
                            <label class="form-label">Position de placement</label>
                            <div class="row">
                                <div class="col-4">
                                    <input type="number" class="form-control" id="factoryX" placeholder="X" value="0">
                                </div>
                                <div class="col-4">
                                    <input type="number" class="form-control" id="factoryY" placeholder="Y" value="0">
                                </div>
                                <div class="col-4">
                                    <input type="number" class="form-control" id="factoryZ" placeholder="Z" value="0">
                                </div>
                            </div>
                            <small class="text-muted">Coordonnées où générer l'usine (multiples de 800 pour X/Y, 100 pour Z)</small>
                        </div>
                        
                        <div id="targetProductionList" class="mb-3">
                            <h6>Productions cibles (par minute)</h6>
                            <div id="productionTargets"></div>
                            <button type="button" class="btn btn-sm btn-outline-primary" id="addProductionTarget">
                                <i class="fas fa-plus"></i> Ajouter une production
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                <button type="button" class="btn btn-primary" id="generateFactory">
                    <i class="fas fa-cogs"></i> Générer l'usine
                </button>
            </div>
        `;
        
        return html;
    }

    attachFactoryGeneratorEvents()
    {
        $('#generateFactory').off('click').on('click', () => {
            this.generateOptimizedFactory();
        });
        
        $('#addProductionTarget').off('click').on('click', () => {
            this.addProductionTargetRow();
        });
        
        $('#optimizationMode').off('change').on('change', () => {
            this.updateOptimizationMode();
        });
        
        this.loadDefaultTargets();
    }

    addProductionTargetRow()
    {
        let itemsDropdown = this.getItemsDropdownHTML();
        let rowId = 'target_' + Date.now();
        
        let html = `
            <div class="row mb-2" id="${rowId}">
                <div class="col-6">
                    ${itemsDropdown}
                </div>
                <div class="col-4">
                    <input type="number" class="form-control" placeholder="Quantité/min" min="1" value="60">
                </div>
                <div class="col-2">
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="$('#${rowId}').remove()">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        $('#productionTargets').append(html);
    }

    getItemsDropdownHTML()
    {
        let html = '<select class="form-select">';
        
        for(let itemId in this.baseLayout.itemsData)
        {
            let currentItem = this.baseLayout.itemsData[itemId];
            if(currentItem.category === 'solid' || currentItem.category === 'liquid')
            {
                html += '<option value="' + itemId + '">' + currentItem.name + '</option>';
            }
        }
        
        html += '</select>';
        return html;
    }

    loadDefaultTargets()
    {
        let endgameTargets = [
            {item: '/Game/FactoryGame/Resource/Parts/ModularFrame/Desc_ModularFrame.Desc_ModularFrame_C', quantity: 120},
            {item: '/Game/FactoryGame/Resource/Parts/SteelPlate/Desc_SteelPlate.Desc_SteelPlate_C', quantity: 300},
            {item: '/Game/FactoryGame/Resource/Parts/Concrete/Desc_Concrete.Desc_Concrete_C', quantity: 600}
        ];
        
        endgameTargets.forEach(target => {
            this.addProductionTargetRow();
            let lastRow = $('#productionTargets .row').last();
            lastRow.find('select').val(target.item);
            lastRow.find('input[type="number"]').val(target.quantity);
        });
    }

    updateOptimizationMode()
    {
        let mode = $('#optimizationMode').val();
        this.factoryGeneratorSettings.optimizationMode = mode;
    }

    async generateOptimizedFactory()
    {
        try {
            $('#generateFactory').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Génération...');
            
            let factoryPlan = this.calculateOptimalFactory();
            
            if(factoryPlan.buildings.length > 0)
            {
                await this.placeFactoryBuildings(factoryPlan);
                
                $('#genericModal').modal('hide');
                
                alert('Usine générée avec succès!\n' + 
                      factoryPlan.buildings.length + ' bâtiments placés\n' +
                      factoryPlan.conveyors.length + ' convoyeurs ajoutés\n' +
                      factoryPlan.foundations.length + ' fondations créées');
            }
            else
            {
                alert('Erreur: Impossible de générer l\'usine avec les paramètres donnés.');
            }
        }
        catch(error)
        {
            console.error('Erreur lors de la génération:', error);
            alert('Erreur lors de la génération de l\'usine: ' + error.message);
        }
        finally
        {
            $('#generateFactory').prop('disabled', false).html('<i class="fas fa-cogs"></i> Générer l\'usine');
        }
    }

    calculateOptimalFactory()
    {
        let targets = this.getProductionTargets();
        let factoryPlan = {
            buildings: [],
            conveyors: [],
            foundations: [],
            powerLines: []
        };
        
        let baseX = parseInt($('#factoryX').val()) || 0;
        let baseY = parseInt($('#factoryY').val()) || 0;
        let baseZ = parseInt($('#factoryZ').val()) || 0;
        
        baseX = Math.round(baseX / 800) * 800;
        baseY = Math.round(baseY / 800) * 800;
        baseZ = Math.round(baseZ / 100) * 100;
        
        let currentX = baseX;
        let currentY = baseY;
        let rowHeight = 1600;
        let buildingSpacing = 1600;
        
        for(let target of targets)
        {
            let productionChain = this.calculateProductionChain(target.item, target.quantity);
            
            for(let step of productionChain)
            {
                for(let i = 0; i < step.buildingCount; i++)
                {
                    let building = this.createBuilding(step.buildingClass, currentX, currentY, baseZ, step.recipe);
                    factoryPlan.buildings.push(building);
                    
                    let foundation = this.createFoundation(currentX, currentY, baseZ - 400);
                    factoryPlan.foundations.push(foundation);
                    
                    currentX += buildingSpacing;
                    
                    if(currentX - baseX > 8000)
                    {
                        currentX = baseX;
                        currentY += rowHeight;
                    }
                }
            }
        }
        
        this.addConveyorConnections(factoryPlan);
        this.addPowerInfrastructure(factoryPlan);
        
        return factoryPlan;
    }

    getProductionTargets()
    {
        let targets = [];
        
        $('#productionTargets .row').each((index, row) => {
            let item = $(row).find('select').val();
            let quantity = parseFloat($(row).find('input[type="number"]').val()) || 0;
            
            if(item && quantity > 0)
            {
                targets.push({item: item, quantity: quantity});
            }
        });
        
        return targets;
    }

    calculateProductionChain(itemId, targetQuantity)
    {
        let chain = [];
        let processedItems = new Set();
        
        this.calculateItemRequirements(itemId, targetQuantity, chain, processedItems);
        
        return chain.reverse();
    }

    calculateItemRequirements(itemId, quantity, chain, processed)
    {
        if(processed.has(itemId)) return;
        processed.add(itemId);
        
        let bestRecipe = this.findBestRecipe(itemId);
        if(!bestRecipe) return;
        
        let recipe = this.baseLayout.recipesData[bestRecipe];
        let outputQuantity = recipe.produce[itemId] || 1;
        let craftingTime = recipe.mManufactoringDuration || 1;
        let productionRate = (60 / craftingTime) * outputQuantity;
        
        let buildingCount = Math.ceil(quantity / productionRate);
        let buildingClass = this.getBestBuildingForRecipe(bestRecipe);
        
        chain.push({
            item: itemId,
            recipe: bestRecipe,
            buildingClass: buildingClass,
            buildingCount: buildingCount,
            targetQuantity: quantity,
            actualQuantity: buildingCount * productionRate
        });
        
        for(let ingredientId in recipe.ingredients)
        {
            let ingredientQuantity = recipe.ingredients[ingredientId] * buildingCount * (60 / craftingTime);
            this.calculateItemRequirements(ingredientId, ingredientQuantity, chain, processed);
        }
    }

    findBestRecipe(itemId)
    {
        let bestRecipe = null;
        let bestEfficiency = 0;
        
        for(let recipeId in this.baseLayout.recipesData)
        {
            let recipe = this.baseLayout.recipesData[recipeId];
            if(recipe.produce && recipe.produce[itemId])
            {
                let efficiency = recipe.produce[itemId] / (recipe.mManufactoringDuration || 1);
                if(efficiency > bestEfficiency)
                {
                    bestEfficiency = efficiency;
                    bestRecipe = recipeId;
                }
            }
        }
        
        return bestRecipe;
    }

    getBestBuildingForRecipe(recipeId)
    {
        let recipe = this.baseLayout.recipesData[recipeId];
        if(recipe.mProducedIn && recipe.mProducedIn.length > 0)
        {
            return recipe.mProducedIn[0];
        }
        return '/Game/FactoryGame/Buildable/Factory/Manufacturer/Build_Manufacturer.Build_Manufacturer_C';
    }

    createBuilding(className, x, y, z, recipeId = null)
    {
        let pathName = 'Persistent_Level:PersistentLevel.FactoryGenerator_Building_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        let building = {
            className: className,
            pathName: pathName,
            outerPathName: 'Persistent_Level',
            transform: {
                rotation: [0, 0, 0, 1],
                translation: [x, y, z],
                scale3d: [1, 1, 1]
            },
            properties: []
        };
        
        if(recipeId)
        {
            building.properties.push({
                name: 'mCurrentRecipe',
                type: 'ObjectProperty',
                value: {
                    levelName: '',
                    pathName: recipeId
                }
            });
        }
        
        return building;
    }

    createFoundation(x, y, z)
    {
        let pathName = 'Persistent_Level:PersistentLevel.FactoryGenerator_Foundation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        return {
            className: '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C',
            pathName: pathName,
            outerPathName: 'Persistent_Level',
            transform: {
                rotation: [0, 0, 0, 1],
                translation: [x, y, z],
                scale3d: [1, 1, 1]
            },
            properties: []
        };
    }

    addConveyorConnections(factoryPlan)
    {
        for(let i = 0; i < factoryPlan.buildings.length - 1; i++)
        {
            let fromBuilding = factoryPlan.buildings[i];
            let toBuilding = factoryPlan.buildings[i + 1];
            
            let conveyor = this.createConveyor(
                fromBuilding.transform.translation,
                toBuilding.transform.translation,
                fromBuilding.pathName,
                toBuilding.pathName
            );
            
            factoryPlan.conveyors.push(conveyor);
        }
    }

    createConveyor(fromPos, toPos, fromBuilding, toBuilding)
    {
        let pathName = 'Persistent_Level:PersistentLevel.FactoryGenerator_Conveyor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        return {
            className: '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C',
            pathName: pathName,
            outerPathName: 'Persistent_Level',
            transform: {
                rotation: [0, 0, 0, 1],
                translation: [(fromPos[0] + toPos[0]) / 2, (fromPos[1] + toPos[1]) / 2, (fromPos[2] + toPos[2]) / 2],
                scale3d: [1, 1, 1]
            },
            properties: [
                {
                    name: 'mConnection0',
                    type: 'StructProperty',
                    value: {
                        connectedComponent: {
                            levelName: '',
                            pathName: fromBuilding
                        }
                    }
                },
                {
                    name: 'mConnection1',
                    type: 'StructProperty',
                    value: {
                        connectedComponent: {
                            levelName: '',
                            pathName: toBuilding
                        }
                    }
                }
            ]
        };
    }

    addPowerInfrastructure(factoryPlan)
    {
        if(factoryPlan.buildings.length === 0) return;
        
        let firstBuilding = factoryPlan.buildings[0];
        let powerPole = this.createBuilding(
            '/Game/FactoryGame/Buildable/Factory/PowerPole/Build_PowerPole.Build_PowerPole_C',
            firstBuilding.transform.translation[0] - 800,
            firstBuilding.transform.translation[1],
            firstBuilding.transform.translation[2] + 600
        );
        
        factoryPlan.buildings.push(powerPole);
        
        let foundation = this.createFoundation(
            powerPole.transform.translation[0],
            powerPole.transform.translation[1],
            powerPole.transform.translation[2] - 1000
        );
        factoryPlan.foundations.push(foundation);
    }

    async placeFactoryBuildings(factoryPlan)
    {
        let allObjects = [...factoryPlan.buildings, ...factoryPlan.foundations, ...factoryPlan.conveyors];
        let promises = [];
        
        for(let object of allObjects)
        {
            // Add object to save game data structure
            this.baseLayout.saveGameParser.addObject(object);
            
            // Parse and render each object
            promises.push(new Promise((resolve) => {
                return this.baseLayout.parseObject(object, resolve);
            }));
        }
        
        // Wait for all objects to be processed
        let results = await Promise.all(promises);
        
        // Add rendered objects to their respective layers
        for(let result of results)
        {
            if(result && result.layer && result.marker)
            {
                this.baseLayout.addElementToLayer(result.layer, result.marker);
            }
        }
        
        // Update layer counts for all affected layers
        let layerIds = new Set();
        for(let result of results)
        {
            if(result && result.layer)
            {
                layerIds.add(result.layer);
            }
        }
        
        for(let layerId of layerIds)
        {
            this.baseLayout.setBadgeLayerCount(layerId);
        }
    }
}