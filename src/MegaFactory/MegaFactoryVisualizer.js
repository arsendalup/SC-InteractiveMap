/**
 * Mega Factory Visualizer for Interactive Map
 * Renders the mega factory design on the Satisfactory map
 */

import MegaFactoryDesign from './MegaFactoryDesign.js';

export default class MegaFactoryVisualizer {
    constructor(baseLayout) {
        this.baseLayout = baseLayout;
        this.design = new MegaFactoryDesign();
        this.markers = [];
        this.connections = [];
        this.zoneColors = {
            northwest: '#4CAF50',  // Green for limestone/concrete
            northeast: '#FF9800',  // Orange for iron/steel
            central: '#2196F3',    // Blue for advanced assembly
            southwest: '#9C27B0',  // Purple for oil/petrochemicals
            southeast: '#F44336'   // Red for nuclear/endgame
        };
    }

    /**
     * Initialize visualization on the map
     */
    initialize() {
        this.createZoneMarkers();
        this.createTransportationNetwork();
        this.createProductionFlowIndicators();
        this.addLegend();
    }

    /**
     * Create zone markers on the map
     */
    createZoneMarkers() {
        const factoryLayout = this.design.generateFactoryLayout();
        
        for (const [zoneId, zone] of Object.entries(factoryLayout.zones)) {
            // Create main zone marker
            const marker = L.circleMarker(
                this.gameToMapCoordinates(zone.coordinates),
                {
                    radius: 50,
                    fillColor: this.zoneColors[zoneId],
                    fillOpacity: 0.3,
                    color: this.zoneColors[zoneId],
                    weight: 3
                }
            );

            // Add zone information popup
            const popupContent = this.createZonePopup(zone, zoneId);
            marker.bindPopup(popupContent);
            
            // Add zone label
            const label = L.divIcon({
                className: 'mega-factory-zone-label',
                html: `<div style="background-color: ${this.zoneColors[zoneId]}; padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold;">${zone.name}</div>`,
                iconSize: [200, 30]
            });
            
            const labelMarker = L.marker(
                this.gameToMapCoordinates({
                    x: zone.coordinates.x,
                    y: zone.coordinates.y - 5000,
                    z: zone.coordinates.z
                }),
                { icon: label }
            );

            this.markers.push(marker);
            this.markers.push(labelMarker);
        }
    }

    /**
     * Create transportation network visualization
     */
    createTransportationNetwork() {
        const zones = Object.values(this.design.factoryZones);
        
        // Create train network connections
        for (let i = 0; i < zones.length; i++) {
            for (let j = i + 1; j < zones.length; j++) {
                const connection = L.polyline([
                    this.gameToMapCoordinates(zones[i].coordinates),
                    this.gameToMapCoordinates(zones[j].coordinates)
                ], {
                    color: '#FFA500',
                    weight: 3,
                    opacity: 0.6,
                    dashArray: '10, 10'
                });
                
                connection.bindPopup('High-speed train connection<br>Capacity: 780 items/min per car');
                this.connections.push(connection);
            }
        }

        // Create hypertube network (star pattern from central)
        const centralZone = this.design.factoryZones.central;
        for (const [zoneId, zone] of Object.entries(this.design.factoryZones)) {
            if (zoneId !== 'central') {
                const hypertube = L.polyline([
                    this.gameToMapCoordinates(centralZone.coordinates),
                    this.gameToMapCoordinates(zone.coordinates)
                ], {
                    color: '#00BCD4',
                    weight: 2,
                    opacity: 0.8
                });
                
                hypertube.bindPopup('Hypertube express route<br>Travel time: < 30 seconds');
                this.connections.push(hypertube);
            }
        }
    }

    /**
     * Create production flow indicators
     */
    createProductionFlowIndicators() {
        // Add resource flow arrows between zones
        const flows = [
            { from: 'northwest', to: 'central', resource: 'Concrete', color: '#808080' },
            { from: 'northeast', to: 'central', resource: 'Steel', color: '#B87333' },
            { from: 'southwest', to: 'central', resource: 'Plastic/Rubber', color: '#E91E63' },
            { from: 'central', to: 'southeast', resource: 'Advanced Components', color: '#3F51B5' },
            { from: 'southeast', to: 'central', resource: 'Endgame Items', color: '#FFD700' }
        ];

        flows.forEach(flow => {
            const fromZone = this.design.factoryZones[flow.from];
            const toZone = this.design.factoryZones[flow.to];
            
            const arrow = L.polyline([
                this.gameToMapCoordinates(fromZone.coordinates),
                this.gameToMapCoordinates(toZone.coordinates)
            ], {
                color: flow.color,
                weight: 5,
                opacity: 0.7
            });
            
            // Add arrowhead
            const decorator = L.polylineDecorator(arrow, {
                patterns: [
                    {
                        offset: '100%',
                        repeat: 0,
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 15,
                            polygon: true,
                            pathOptions: { fillOpacity: 1, color: flow.color, weight: 0 }
                        })
                    }
                ]
            });
            
            arrow.bindPopup(`${flow.resource} Flow<br>From: ${fromZone.name}<br>To: ${toZone.name}`);
            this.connections.push(arrow);
            this.connections.push(decorator);
        });
    }

    /**
     * Create zone information popup
     */
    createZonePopup(zone, zoneId) {
        const totalExtraction = this.design.calculateTotalResourceExtraction();
        const endgameReq = this.design.calculateEndgameProductionRequirements();
        
        let resourceInfo = '<b>Primary Resources:</b><br>';
        zone.primaryResources.forEach(resource => {
            if (totalExtraction[resource]) {
                resourceInfo += `- ${resource}: ${totalExtraction[resource].toFixed(0)}/min<br>`;
            }
        });

        let productionInfo = '<b>Production Focus:</b><br>';
        zone.production.forEach(product => {
            productionInfo += `- ${product}<br>`;
        });

        return `
            <div style="min-width: 300px;">
                <h3>${zone.name}</h3>
                <p>${zone.description}</p>
                ${resourceInfo}
                <br>
                ${productionInfo}
                <br>
                <b>Coordinates:</b> X: ${zone.coordinates.x}, Y: ${zone.coordinates.y}
            </div>
        `;
    }

    /**
     * Add legend to the map
     */
    addLegend() {
        const legend = L.control({ position: 'bottomright' });
        
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'mega-factory-legend');
            div.style.backgroundColor = 'white';
            div.style.padding = '10px';
            div.style.border = '2px solid black';
            div.style.borderRadius = '5px';
            
            div.innerHTML = `
                <h4>Mega Factory Zones</h4>
                <div style="margin: 5px 0;"><span style="color: ${this.zoneColors.northwest};">■</span> Northwest - Concrete & Basic Materials</div>
                <div style="margin: 5px 0;"><span style="color: ${this.zoneColors.northeast};">■</span> Northeast - Steel & Power</div>
                <div style="margin: 5px 0;"><span style="color: ${this.zoneColors.central};">■</span> Central - Advanced Assembly</div>
                <div style="margin: 5px 0;"><span style="color: ${this.zoneColors.southwest};">■</span> Southwest - Oil & Petrochemicals</div>
                <div style="margin: 5px 0;"><span style="color: ${this.zoneColors.southeast};">■</span> Southeast - Nuclear & Endgame</div>
                <hr>
                <h4>Transportation</h4>
                <div style="margin: 5px 0;"><span style="color: #FFA500;">---</span> Train Network</div>
                <div style="margin: 5px 0;"><span style="color: #00BCD4;">―</span> Hypertube Express</div>
                <hr>
                <h4>Production Stats</h4>
                <div style="font-size: 12px;">
                    Total Power: 340 GW<br>
                    Endgame Output: 100% requirements<br>
                    Efficiency: Maximum with alternate recipes
                </div>
            `;
            
            return div;
        };
        
        if(this.baseLayout.satisfactoryMap && this.baseLayout.satisfactoryMap.leafletMap)
        {
            this.baseLayout.satisfactoryMap.leafletMap.addControl(legend);
        }
    }

    /**
     * Convert game coordinates to map coordinates
     */
    gameToMapCoordinates(coords) {
        // Satisfactory map is roughly 800000x750000 units
        // Convert to Leaflet coordinates (0-1000 range)
        const xScale = 1000 / 800000;
        const yScale = 1000 / 750000;
        
        return [
            500 + (coords.y * yScale),  // Leaflet uses [lat, lng] = [y, x]
            500 + (coords.x * xScale)
        ];
    }

    /**
     * Show/hide mega factory visualization
     */
    toggle(show) {
        if (show && this.baseLayout.satisfactoryMap && this.baseLayout.satisfactoryMap.leafletMap) {
            this.markers.forEach(marker => marker.addTo(this.baseLayout.satisfactoryMap.leafletMap));
            this.connections.forEach(connection => connection.addTo(this.baseLayout.satisfactoryMap.leafletMap));
        } else {
            this.markers.forEach(marker => marker.remove());
            this.connections.forEach(connection => connection.remove());
        }
    }

    /**
     * Export factory design as JSON for save file generation
     */
    exportDesign() {
        const buildOrder = this.design.getOptimalBuildOrder();
        const zones = this.design.factoryZones;
        const chains = this.design.productionChains;
        
        return {
            version: "1.0",
            created: new Date().toISOString(),
            design: {
                zones: zones,
                productionChains: chains,
                buildOrder: buildOrder,
                requirements: this.design.endgameRequirements,
                totalResources: this.design.calculateTotalResourceExtraction()
            }
        };
    }
}