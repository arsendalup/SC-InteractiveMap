/**
 * Mega Factory Design for Satisfactory Endgame
 * Covers entire map and produces all endgame requirements optimally
 * Based on Update 1.0 data
 */

export default class MegaFactoryDesign {
    constructor() {
        // Phase 5 Space Elevator Requirements (Endgame)
        this.endgameRequirements = {
            assemblyDirectorSystem: 4000,
            magneticFieldGenerator: 4000,
            nuclearPasta: 1000,
            thermalPropulsionRocket: 1000
        };

        // Total available resource nodes on map
        this.totalResourceNodes = {
            limestone: { impure: 15, normal: 50, pure: 29 },
            ironOre: { impure: 39, normal: 42, pure: 46 },
            copperOre: { impure: 13, normal: 29, pure: 13 },
            cateriumOre: { impure: 0, normal: 9, pure: 8 },
            coal: { impure: 15, normal: 31, pure: 16 },
            crudeOil: { impure: 10, normal: 12, pure: 8 },
            sulfur: { impure: 6, normal: 5, pure: 5 },
            bauxite: { impure: 5, normal: 6, pure: 6 },
            rawQuartz: { impure: 3, normal: 7, pure: 7 },
            uranium: { impure: 0, normal: 3, pure: 2 },
            sam: { impure: 10, normal: 6, pure: 3 }
        };

        // Mining rates per minute (with Miner Mk.3)
        this.miningRates = {
            impure: 60,     // 30 * 2
            normal: 120,    // 60 * 2
            pure: 240       // 120 * 2
        };

        // Factory zones organized by biome/region
        this.factoryZones = this.initializeFactoryZones();
        
        // Production chains using optimal alternate recipes
        this.productionChains = this.initializeProductionChains();
    }

    initializeFactoryZones() {
        return {
            // Northwest - Limestone & Early Game Hub
            northwest: {
                name: "Northwest Industrial Complex",
                coordinates: { x: -150000, y: -150000, z: 0 },
                primaryResources: ["limestone", "ironOre"],
                production: ["concrete", "ironPlates", "ironRods", "screws"],
                description: "Main concrete and basic iron production"
            },

            // Northeast - Iron & Coal Power
            northeast: {
                name: "Northeast Iron & Power District",
                coordinates: { x: 150000, y: -150000, z: 0 },
                primaryResources: ["ironOre", "coal", "sulfur"],
                production: ["steel", "powerGeneration", "blackPowder"],
                description: "Steel production and coal power generation hub"
            },

            // Central - Main Assembly Hub
            central: {
                name: "Central Assembly Megaplex",
                coordinates: { x: 0, y: 0, z: 0 },
                primaryResources: ["bauxite", "cateriumOre"],
                production: ["aluminum", "supercomputers", "advancedComponents"],
                description: "Advanced component assembly and aluminum processing"
            },

            // Southwest - Oil Processing
            southwest: {
                name: "Southwest Petrochemical Complex",
                coordinates: { x: -150000, y: 150000, z: 0 },
                primaryResources: ["crudeOil", "copperOre"],
                production: ["plastic", "rubber", "fuel", "petrochemicals"],
                description: "Oil refinement and polymer production"
            },

            // Southeast - Nuclear & Endgame
            southeast: {
                name: "Southeast Nuclear & Space Complex",
                coordinates: { x: 150000, y: 150000, z: 0 },
                primaryResources: ["uranium", "rawQuartz"],
                production: ["nuclearPower", "endgameItems", "quantumTechnology"],
                description: "Nuclear power and endgame item production"
            }
        };
    }

    initializeProductionChains() {
        return {
            // Optimal steel production chain
            steelProduction: {
                recipe: "Solid Steel Ingot",
                inputs: { ironOre: 2, coal: 2 },
                outputs: { steelIngot: 3 },
                efficiency: 1.5,
                alternateRecipes: ["Pure Iron Ingot", "Compacted Coal"]
            },

            // Oil to fuel/plastic chain
            oilProcessing: {
                recipe: "Heavy Oil Residue + Diluted Fuel",
                inputs: { crudeOil: 3 },
                outputs: { fuel: 4, polymerResin: 2 },
                efficiency: 4.5,
                alternateRecipes: ["Recycled Plastic", "Recycled Rubber"]
            },

            // Nuclear power optimization
            nuclearPower: {
                recipe: "Uranium Fuel Unit",
                inputs: { uranium: 1, encasedIndustrialBeam: 3, electromagneticControlRod: 2 },
                outputs: { uraniumFuelRod: 1, uraniumWaste: 50 },
                powerGeneration: 2500,
                alternateRecipes: ["Infused Uranium Cell", "Uranium Fuel Unit"]
            },

            // Endgame production lines
            endgameProduction: {
                assemblyDirectorSystem: {
                    inputs: { adaptiveControlUnit: 2, supercomputer: 1 },
                    outputs: { assemblyDirectorSystem: 1 },
                    productionRate: 0.75
                },
                magneticFieldGenerator: {
                    inputs: { versatileFramework: 5, electromagneticControlRod: 2, battery: 10 },
                    outputs: { magneticFieldGenerator: 1 },
                    productionRate: 1.0
                },
                nuclearPasta: {
                    inputs: { copperPowder: 200, pressureConversionCube: 1 },
                    outputs: { nuclearPasta: 1 },
                    productionRate: 0.5
                },
                thermalPropulsionRocket: {
                    inputs: { modularEngine: 5, turboMotor: 2, coolingSystem: 12, fusedModularFrame: 2 },
                    outputs: { thermalPropulsionRocket: 1 },
                    productionRate: 2.0
                }
            }
        };
    }

    calculateTotalResourceExtraction() {
        const totalExtraction = {};
        
        for (const [resource, nodes] of Object.entries(this.totalResourceNodes)) {
            const total = (nodes.impure * this.miningRates.impure) +
                         (nodes.normal * this.miningRates.normal) +
                         (nodes.pure * this.miningRates.pure);
            totalExtraction[resource] = total;
        }
        
        return totalExtraction;
    }

    calculateEndgameProductionRequirements() {
        // Calculate backwards from endgame requirements
        const requirements = {};
        const productionTime = 60 * 24; // 24 hours of production
        
        // Calculate required production rates
        requirements.assemblyDirectorSystemRate = this.endgameRequirements.assemblyDirectorSystem / productionTime;
        requirements.magneticFieldGeneratorRate = this.endgameRequirements.magneticFieldGenerator / productionTime;
        requirements.nuclearPastaRate = this.endgameRequirements.nuclearPasta / productionTime;
        requirements.thermalPropulsionRocketRate = this.endgameRequirements.thermalPropulsionRocket / productionTime;
        
        return requirements;
    }

    generateFactoryLayout() {
        return {
            zones: this.factoryZones,
            mainTransportation: {
                type: "HyperTube + Train Network",
                trainStations: 25,
                hypertubeNetwork: "Full map coverage with express routes between zones",
                droneNetwork: "Supplementary for high-value items"
            },
            powerGrid: {
                totalCapacity: "340 GW",
                sources: {
                    nuclear: "300 GW (120 reactors)",
                    fuel: "30 GW (100 generators)",
                    geothermal: "10 GW (all nodes)"
                },
                distribution: "Redundant grid with zone isolation capability"
            },
            logistics: {
                conveyorNetwork: "Mk.5 belts for main arteries",
                pipelineNetwork: "Mk.2 pipes for all fluid transport",
                storageHubs: "Central storage in each zone with overflow management"
            }
        };
    }

    getOptimalBuildOrder() {
        return [
            {
                phase: 1,
                name: "Foundation & Power",
                tasks: [
                    "Establish coal power in Northeast (30 GW)",
                    "Set up basic iron and copper production",
                    "Build initial concrete production in Northwest"
                ]
            },
            {
                phase: 2,
                name: "Steel & Oil",
                tasks: [
                    "Implement Solid Steel Ingot production chain",
                    "Set up oil processing in Southwest",
                    "Establish fuel power generation (30 GW)"
                ]
            },
            {
                phase: 3,
                name: "Advanced Production",
                tasks: [
                    "Build aluminum processing in Central zone",
                    "Set up computer and heavy modular frame production",
                    "Implement optimal alternate recipe chains"
                ]
            },
            {
                phase: 4,
                name: "Nuclear & Transportation",
                tasks: [
                    "Build nuclear power infrastructure (300 GW)",
                    "Complete train network between all zones",
                    "Set up uranium processing chain"
                ]
            },
            {
                phase: 5,
                name: "Endgame Production",
                tasks: [
                    "Build Assembly Director System production lines",
                    "Set up Magnetic Field Generator factories",
                    "Implement Nuclear Pasta production",
                    "Create Thermal Propulsion Rocket assembly"
                ]
            }
        ];
    }
}