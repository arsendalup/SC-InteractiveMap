/**
 * Mega Factory Standalone Mode
 * Generates the mega factory visualization without requiring a save file
 */

import MegaFactoryDesign from './MegaFactoryDesign.js';
import MegaFactoryVisualizer from './MegaFactoryVisualizer.js';

export default class MegaFactoryStandalone {
    constructor() {
        this.design = new MegaFactoryDesign();
        this.visualizer = null;
        this.map = null;
        this.initialized = false;
    }

    /**
     * Initialize the standalone mega factory without save file
     */
    async initialize() {
        try {
            console.log('Initializing Mega Factory Standalone Mode...');
            
            // Initialize the map directly
            await this.initializeMap();
            
            // Create minimal base layout for visualizer
            this.createMinimalBaseLayout();
            
            // Initialize visualizer
            this.initializeVisualizer();
            
            // Add some test markers to verify map is working
            this.addTestMarkers();
            
            // Show the mega factory immediately
            this.showMegaFactory();
            
            console.log('Mega Factory Standalone Mode initialized successfully!');
            this.initialized = true;
            
        } catch (error) {
            console.error('Error initializing Mega Factory Standalone:', error);
            throw error;
        }
    }

    /**
     * Initialize Leaflet map directly
     */
    async initializeMap() {
        // Create map container if it doesn't exist
        if (!document.getElementById('leafletMap')) {
            const mapContainer = document.createElement('div');
            mapContainer.id = 'leafletMap';
            mapContainer.style.height = '80vh';
            mapContainer.style.width = '100%';
            document.body.appendChild(mapContainer);
        }

        // Initialize Leaflet map
        this.map = L.map('leafletMap', {
            crs: L.CRS.Simple,
            minZoom: 1,
            maxZoom: 6,
            zoomControl: true,
            attributionControl: false
        });

        // Set map bounds (converted to Leaflet coordinates)
        const bounds = [[0, 0], [1000, 1000]];
        this.map.fitBounds(bounds);
        this.map.setView([500, 500], 3);

        // Add base tile layer (simple grid)
        this.addBaseLayer();

        console.log('Map initialized');
    }

    /**
     * Add base layer to the map
     */
    addBaseLayer() {
        // Create a tile layer with a simple pattern
        const tileLayer = L.tileLayer('data:image/svg+xml;base64,' + btoa(`
            <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <rect width="32" height="32" fill="#1a1a1a"/>
                        <rect width="32" height="32" fill="none" stroke="#333" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="256" height="256" fill="url(#grid)"/>
                <text x="128" y="130" text-anchor="middle" fill="#555" font-family="Arial" font-size="12">Satisfactory Map</text>
            </svg>
        `), {
            minZoom: 1,
            maxZoom: 6,
            tileSize: 256,
            noWrap: true
        });

        tileLayer.addTo(this.map);

        // Add compass directions
        this.addMapLabels();
    }

    /**
     * Add map labels and directions
     */
    addMapLabels() {
        // Add directional markers
        const directions = [
            { pos: [100, 500], text: 'W', color: '#666' },
            { pos: [900, 500], text: 'E', color: '#666' },
            { pos: [500, 100], text: 'N', color: '#666' },
            { pos: [500, 900], text: 'S', color: '#666' }
        ];

        directions.forEach(dir => {
            L.marker(dir.pos, {
                icon: L.divIcon({
                    className: 'direction-label',
                    html: `<div style="color: ${dir.color}; font-size: 24px; font-weight: bold; text-align: center; width: 30px;">${dir.text}</div>`,
                    iconSize: [30, 30]
                })
            }).addTo(this.map);
        });
    }

    /**
     * Add test markers to verify map is working
     */
    addTestMarkers() {
        // Add center marker
        L.marker([500, 500], {
            icon: L.divIcon({
                className: 'test-marker',
                html: '<div style="background: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
                iconSize: [20, 20]
            })
        }).bindPopup('Map Center (500, 500)').addTo(this.map);

        // Add corner markers
        L.marker([100, 100]).bindPopup('Top-Left Corner').addTo(this.map);
        L.marker([100, 900]).bindPopup('Top-Right Corner').addTo(this.map);
        L.marker([900, 100]).bindPopup('Bottom-Left Corner').addTo(this.map);
        L.marker([900, 900]).bindPopup('Bottom-Right Corner').addTo(this.map);

        console.log('Test markers added to map');
    }

    /**
     * Create minimal base layout object for the visualizer
     */
    createMinimalBaseLayout() {
        this.baseLayout = {
            satisfactoryMap: {
                leafletMap: this.map,
                unproject: (coords) => {
                    // Convert game coordinates to Leaflet coordinates
                    // Satisfactory map is roughly 800000x750000 units
                    const xScale = 1000 / 800000;
                    const yScale = 1000 / 750000;
                    
                    return [
                        500 + (coords[1] * yScale),  // Y coordinate
                        500 + (coords[0] * xScale)   // X coordinate
                    ];
                }
            },
            notify: (message, type = 'info') => {
                console.log(`[${type.toUpperCase()}] ${message}`);
                
                // Create simple notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
                    color: white;
                    padding: 15px 20px;
                    border-radius: 5px;
                    z-index: 10000;
                    max-width: 300px;
                `;
                notification.textContent = message;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
            }
        };
    }

    /**
     * Initialize the mega factory visualizer
     */
    initializeVisualizer() {
        this.visualizer = new MegaFactoryVisualizer(this.baseLayout);
        this.visualizer.initialize();
        console.log('Mega Factory Visualizer initialized');
    }

    /**
     * Show the mega factory visualization
     */
    showMegaFactory() {
        if (this.visualizer) {
            this.visualizer.toggle(true);
            
            // Show statistics modal automatically
            this.showStatisticsModal();
            
            console.log('Mega Factory visualization displayed');
        }
    }

    /**
     * Show statistics modal with mega factory information
     */
    showStatisticsModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('megaFactoryModal');
        if (!modal) {
            modal = this.createStatisticsModal();
        }

        // Show modal
        if (window.$ && window.$.fn.modal) {
            $(modal).modal('show');
        } else {
            modal.style.display = 'block';
        }
    }

    /**
     * Create statistics modal
     */
    createStatisticsModal() {
        const modal = document.createElement('div');
        modal.id = 'megaFactoryModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content" style="background-color: #2a2a2a; border: 1px solid #444;">
                    <div class="modal-header" style="background-color: #343a40; border-bottom: 1px solid #444;">
                        <h5 class="modal-title" style="color: #FFA500;">🏭 Mega Factory - Endgame Base Visualization</h5>
                        <button type="button" class="close" onclick="this.closest('.modal').style.display='none'">
                            <span style="color: white;">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" style="color: white;">
                        ${this.generateModalContent()}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').style.display='none'">Close</button>
                        <button type="button" class="btn btn-success" onclick="window.megaFactory.exportDesign()">Export Design</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Generate modal content
     */
    generateModalContent() {
        const endgameReq = this.design.calculateEndgameProductionRequirements();
        const totalResources = this.design.calculateTotalResourceExtraction();

        let html = `
            <div class="row">
                <div class="col-md-12">
                    <h6>🎯 Space Elevator Phase 5 Requirements</h6>
                    <table class="table table-dark table-sm">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Required</th>
                                <th>Production Rate</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Assembly Director System</td>
                                <td>${this.design.endgameRequirements.assemblyDirectorSystem.toLocaleString()}</td>
                                <td>${endgameReq.assemblyDirectorSystemRate.toFixed(2)}/min</td>
                                <td><span class="badge badge-success">✓ Optimized</span></td>
                            </tr>
                            <tr>
                                <td>Magnetic Field Generator</td>
                                <td>${this.design.endgameRequirements.magneticFieldGenerator.toLocaleString()}</td>
                                <td>${endgameReq.magneticFieldGeneratorRate.toFixed(2)}/min</td>
                                <td><span class="badge badge-success">✓ Optimized</span></td>
                            </tr>
                            <tr>
                                <td>Nuclear Pasta</td>
                                <td>${this.design.endgameRequirements.nuclearPasta.toLocaleString()}</td>
                                <td>${endgameReq.nuclearPastaRate.toFixed(2)}/min</td>
                                <td><span class="badge badge-success">✓ Optimized</span></td>
                            </tr>
                            <tr>
                                <td>Thermal Propulsion Rocket</td>
                                <td>${this.design.endgameRequirements.thermalPropulsionRocket.toLocaleString()}</td>
                                <td>${endgameReq.thermalPropulsionRocketRate.toFixed(2)}/min</td>
                                <td><span class="badge badge-success">✓ Optimized</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-md-6">
                    <h6>🏭 Production Zones</h6>
                    <ul class="list-unstyled">
                        <li><span style="color: #4CAF50;">■</span> <strong>Northwest</strong> - Concrete & Basic Materials</li>
                        <li><span style="color: #FF9800;">■</span> <strong>Northeast</strong> - Steel & Power Generation</li>
                        <li><span style="color: #2196F3;">■</span> <strong>Central</strong> - Advanced Assembly Hub</li>
                        <li><span style="color: #9C27B0;">■</span> <strong>Southwest</strong> - Oil & Petrochemicals</li>
                        <li><span style="color: #F44336;">■</span> <strong>Southeast</strong> - Nuclear & Endgame</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>⚡ Infrastructure Overview</h6>
                    <ul class="list-unstyled">
                        <li><strong>Total Power:</strong> 340 GW</li>
                        <li><strong>Resource Extractors:</strong> ${Object.values(this.design.totalResourceNodes).reduce((acc, nodes) => acc + nodes.pure + nodes.normal + nodes.impure, 0)} total</li>
                        <li><strong>Transport Network:</strong> Complete coverage</li>
                        <li><strong>Efficiency:</strong> Maximum with alternate recipes</li>
                    </ul>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-md-12">
                    <h6>📋 Implementation Guide</h6>
                    <ol>
                        <li><strong>Phase 1:</strong> Establish coal power and basic production (Northwest/Northeast)</li>
                        <li><strong>Phase 2:</strong> Implement steel production chains and oil processing</li>
                        <li><strong>Phase 3:</strong> Build advanced component assembly (Central zone)</li>
                        <li><strong>Phase 4:</strong> Deploy nuclear power and transportation network</li>
                        <li><strong>Phase 5:</strong> Complete endgame production lines (Southeast zone)</li>
                    </ol>
                </div>
            </div>

            <div class="alert alert-info mt-3">
                <h6>💡 How to Use This Design:</h6>
                <p>
                    1. Explore the map zones by clicking on the colored areas<br>
                    2. Use the legend to understand the layout<br>
                    3. Export the design for detailed specifications<br>
                    4. Follow the implementation guide for optimal build order
                </p>
            </div>
        `;

        return html;
    }

    /**
     * Export design
     */
    exportDesign() {
        const design = this.visualizer.exportDesign();
        const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mega-factory-design.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.baseLayout.notify('Mega Factory design exported successfully!', 'success');
    }

    /**
     * Get current design data
     */
    getDesignData() {
        return {
            zones: this.design.factoryZones,
            requirements: this.design.endgameRequirements,
            resources: this.design.calculateTotalResourceExtraction(),
            buildOrder: this.design.getOptimalBuildOrder()
        };
    }
}