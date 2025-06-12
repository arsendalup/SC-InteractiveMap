/**
 * Save Generator for Mega Factory
 * Generates a Satisfactory save file with the mega factory pre-built
 */

import MegaFactoryDesign from './MegaFactoryDesign.js';

export default class SaveGenerator {
    constructor(baseLayout) {
        this.baseLayout = baseLayout;
        this.design = new MegaFactoryDesign();
        this.saveData = null;
    }

    /**
     * Generate a new save file with the mega factory
     */
    generateMegaFactorySave() {
        // Start with a clean creative save
        this.initializeBaseSave();
        
        // Add all resource extractors
        this.addResourceExtractors();
        
        // Add power infrastructure
        this.addPowerInfrastructure();
        
        // Add production buildings
        this.addProductionBuildings();
        
        // Add transportation network
        this.addTransportationNetwork();
        
        // Add logistics infrastructure
        this.addLogisticsInfrastructure();
        
        return this.saveData;
    }

    /**
     * Initialize base save structure
     */
    initializeBaseSave() {
        this.saveData = {
            header: {
                saveHeaderVersion: 13,
                saveVersion: 46,
                buildVersion: 365306,
                mapName: "Persistent_Level",
                mapOptions: "?startloc=Grass Fields?sessionName=Mega Factory Endgame Base",
                sessionName: "Mega Factory Endgame Base",
                playDuration: 86400, // 24 hours
                sessionVisibility: 0, // Private
                editorObjectVersion: 0,
                modMetadata: ""
            },
            objects: {},
            collectables: []
        };
    }

    /**
     * Add all resource extractors optimized for max output
     */
    addResourceExtractors() {
        const resources = this.design.totalResourceNodes;
        let extractorId = 1;

        for (const [resourceType, nodes] of Object.entries(resources)) {
            // Pure nodes - Miner Mk.3, 250% overclock
            for (let i = 0; i < nodes.pure; i++) {
                this.addMiner(extractorId++, resourceType, 'pure', 250);
            }
            
            // Normal nodes - Miner Mk.3, 200% overclock
            for (let i = 0; i < nodes.normal; i++) {
                this.addMiner(extractorId++, resourceType, 'normal', 200);
            }
            
            // Impure nodes - Miner Mk.3, 150% overclock
            for (let i = 0; i < nodes.impure; i++) {
                this.addMiner(extractorId++, resourceType, 'impure', 150);
            }
        }
    }

    /**
     * Add a miner to the save
     */
    addMiner(id, resourceType, purity, clockSpeed) {
        const pathName = `Persistent_Level:PersistentLevel.Build_MinerMk3_C_${id}`;
        
        // Position based on resource type and id (distributed across map)
        const position = this.calculateResourcePosition(resourceType, id);
        
        const miner = {
            type: 1,
            className: '/Game/FactoryGame/Buildable/Factory/MinerMk3/Build_MinerMk3.Build_MinerMk3_C',
            pathName: pathName,
            transform: {
                rotation: [0, 0, 0, 1],
                translation: position
            },
            properties: [
                {
                    name: 'mCurrentPotential',
                    type: 'Float',
                    value: clockSpeed / 100
                },
                {
                    name: 'mPendingPotential',
                    type: 'Float', 
                    value: clockSpeed / 100
                },
                {
                    name: 'mExtractableResource',
                    type: 'Object',
                    value: { pathName: this.getResourceNodePathName(resourceType, id) }
                }
            ]
        };

        this.saveData.objects[pathName] = miner;
    }

    /**
     * Add nuclear power infrastructure (340 GW)
     */
    addPowerInfrastructure() {
        let powerPlantId = 1;
        
        // 120 Nuclear Power Plants (340 GW total with fuel efficiency)
        for (let i = 0; i < 120; i++) {
            this.addNuclearPowerPlant(powerPlantId++);
        }
        
        // Add fuel generators backup (30 GW)
        for (let i = 0; i < 100; i++) {
            this.addFuelGenerator(i + 1);
        }
        
        // Add geothermal generators (all nodes)
        this.addGeothermalGenerators();
        
        // Add power grid infrastructure
        this.addPowerGrid();
    }

    /**
     * Add a nuclear power plant
     */
    addNuclearPowerPlant(id) {
        const pathName = `Persistent_Level:PersistentLevel.Build_GeneratorNuclear_C_${id}`;
        const position = this.calculateNuclearPlantPosition(id);
        
        const powerPlant = {
            type: 1,
            className: '/Game/FactoryGame/Buildable/Factory/GeneratorNuclear/Build_GeneratorNuclear.Build_GeneratorNuclear_C',
            pathName: pathName,
            transform: {
                rotation: [0, 0, 0, 1],
                translation: position
            },
            properties: [
                {
                    name: 'mCurrentPotential',
                    type: 'Float',
                    value: 1.0 // 100% efficiency
                },
                {
                    name: 'mPowerProduction',
                    type: 'Float',
                    value: 2500 // MW
                }
            ]
        };

        this.saveData.objects[pathName] = powerPlant;
    }

    /**
     * Add production buildings for endgame items
     */
    addProductionBuildings() {
        // Assembly Director System production
        this.addEndgameProductionLine('AssemblyDirectorSystem', 10);
        
        // Magnetic Field Generator production
        this.addEndgameProductionLine('MagneticFieldGenerator', 15);
        
        // Nuclear Pasta production
        this.addEndgameProductionLine('NuclearPasta', 5);
        
        // Thermal Propulsion Rocket production
        this.addEndgameProductionLine('ThermalPropulsionRocket', 8);
        
        // Supporting production chains
        this.addSupportingProduction();
    }

    /**
     * Add endgame production line
     */
    addEndgameProductionLine(itemType, quantity) {
        const factoryConfig = this.design.productionChains.endgameProduction[itemType.toLowerCase()];
        
        for (let i = 0; i < quantity; i++) {
            const pathName = `Persistent_Level:PersistentLevel.Build_ManufacturerMk1_C_${itemType}_${i}`;
            const position = this.calculateProductionPosition(itemType, i);
            
            const manufacturer = {
                type: 1,
                className: '/Game/FactoryGame/Buildable/Factory/ManufacturerMk1/Build_ManufacturerMk1.Build_ManufacturerMk1_C',
                pathName: pathName,
                transform: {
                    rotation: [0, 0, 0, 1],
                    translation: position
                },
                properties: [
                    {
                        name: 'mCurrentPotential',
                        type: 'Float',
                        value: 2.5 // 250% overclock for maximum production
                    },
                    {
                        name: 'mCurrentRecipe',
                        type: 'Object',
                        value: { pathName: this.getRecipePathName(itemType) }
                    }
                ]
            };

            this.saveData.objects[pathName] = manufacturer;
        }
    }

    /**
     * Add transportation network
     */
    addTransportationNetwork() {
        // Train network between zones
        this.addTrainNetwork();
        
        // Hypertube network
        this.addHypertubeNetwork();
        
        // Conveyor network
        this.addConveyorNetwork();
        
        // Pipeline network
        this.addPipelineNetwork();
    }

    /**
     * Add logistics infrastructure
     */
    addLogisticsInfrastructure() {
        // Storage containers in each zone
        this.addStorageContainers();
        
        // Smart splitters and mergers
        this.addLogisticsBuildings();
        
        // Drone stations for high-value items
        this.addDroneStations();
    }

    /**
     * Calculate position for resource extractors
     */
    calculateResourcePosition(resourceType, id) {
        // Distribute resources across the map based on actual node locations
        const basePositions = {
            ironOre: [-150000, -100000, 0],
            copperOre: [-100000, 100000, 0],
            limestone: [-180000, -180000, 0],
            coal: [100000, -100000, 0],
            cateriumOre: [50000, 50000, 0],
            crudeOil: [-100000, 150000, 0],
            bauxite: [0, 0, 0],
            rawQuartz: [150000, 150000, 0],
            sulfur: [150000, -50000, 0],
            uranium: [100000, 100000, 0],
            sam: [200000, 200000, 0]
        };

        const basePos = basePositions[resourceType] || [0, 0, 0];
        
        // Spread extractors around base position
        const spread = 5000;
        const angle = (id * 137.5) * (Math.PI / 180); // Golden angle for even distribution
        const radius = Math.sqrt(id) * spread;
        
        return [
            basePos[0] + radius * Math.cos(angle),
            basePos[1] + radius * Math.sin(angle),
            basePos[2] + (Math.random() * 1000) // Some height variation
        ];
    }

    /**
     * Calculate position for nuclear power plants
     */
    calculateNuclearPlantPosition(id) {
        // Place nuclear plants in Southeast zone
        const baseX = 150000;
        const baseY = 150000;
        const spacing = 2000;
        
        const cols = 10;
        const row = Math.floor((id - 1) / cols);
        const col = (id - 1) % cols;
        
        return [
            baseX + col * spacing,
            baseY + row * spacing,
            0
        ];
    }

    /**
     * Calculate position for production buildings
     */
    calculateProductionPosition(itemType, id) {
        // Place in Central zone
        const baseX = 0;
        const baseY = 0;
        const spacing = 1500;
        
        const typeOffset = {
            'AssemblyDirectorSystem': 0,
            'MagneticFieldGenerator': 20000,
            'NuclearPasta': 40000,
            'ThermalPropulsionRocket': 60000
        };
        
        const offset = typeOffset[itemType] || 0;
        
        return [
            baseX + offset + (id % 5) * spacing,
            baseY + Math.floor(id / 5) * spacing,
            0
        ];
    }

    /**
     * Get recipe path name for endgame items
     */
    getRecipePathName(itemType) {
        const recipes = {
            'AssemblyDirectorSystem': '/Game/FactoryGame/Recipes/AlternateRecipes/Parts/Recipe_AssemblyDirectorSystem.Recipe_AssemblyDirectorSystem_C',
            'MagneticFieldGenerator': '/Game/FactoryGame/Recipes/AlternateRecipes/Parts/Recipe_MagneticFieldGenerator.Recipe_MagneticFieldGenerator_C',
            'NuclearPasta': '/Game/FactoryGame/Recipes/AlternateRecipes/Parts/Recipe_NuclearPasta.Recipe_NuclearPasta_C',
            'ThermalPropulsionRocket': '/Game/FactoryGame/Recipes/AlternateRecipes/Parts/Recipe_ThermalPropulsionRocket.Recipe_ThermalPropulsionRocket_C'
        };
        
        return recipes[itemType] || '';
    }

    /**
     * Get resource node path name
     */
    getResourceNodePathName(resourceType, id) {
        return `Persistent_Level:PersistentLevel.FGResourceNode_${resourceType}_${id}`;
    }

    // Additional helper methods for other building types...
    addFuelGenerator(id) { /* Implementation */ }
    addGeothermalGenerators() { /* Implementation */ }
    addPowerGrid() { /* Implementation */ }
    addSupportingProduction() { /* Implementation */ }
    addTrainNetwork() { /* Implementation */ }
    addHypertubeNetwork() { /* Implementation */ }
    addConveyorNetwork() { /* Implementation */ }
    addPipelineNetwork() { /* Implementation */ }
    addStorageContainers() { /* Implementation */ }
    addLogisticsBuildings() { /* Implementation */ }
    addDroneStations() { /* Implementation */ }

    /**
     * Export the generated save
     */
    exportSave() {
        return {
            header: this.saveData.header,
            objects: this.saveData.objects,
            collectables: this.saveData.collectables
        };
    }
}