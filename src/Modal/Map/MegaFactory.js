/**
 * Mega Factory Modal for Interactive Map
 * Provides UI controls for the mega factory visualization
 */

import MegaFactoryVisualizer from '../../MegaFactory/MegaFactoryVisualizer.js';

export default class ModalMapMegaFactory {
    constructor(options) {
        this.baseLayout = options.baseLayout;
        this.visualizer = null;
        this.isVisible = false;
    }

    parse() {
        // Initialize visualizer if not already done
        if (!this.visualizer) {
            this.visualizer = new MegaFactoryVisualizer(this.baseLayout);
        }

        let html = '<div class="modal fade" id="modalMegaFactory" tabindex="-1">';
            html += '<div class="modal-dialog modal-lg">';
                html += '<div class="modal-content">';
                    html += '<div class="modal-header">';
                        html += '<h5 class="modal-title">Mega Factory - Endgame Optimization</h5>';
                        html += '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>';
                    html += '</div>';
                    html += '<div class="modal-body">';
                        html += this.getBodyContent();
                    html += '</div>';
                    html += '<div class="modal-footer">';
                        html += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
                        html += '<button type="button" class="btn btn-success" id="exportMegaFactoryDesign">Export Design</button>';
                    html += '</div>';
                html += '</div>';
            html += '</div>';
        html += '</div>';

        $('#modalContainer').empty().html(html);
        this.bindEvents();
        $('#modalMegaFactory').modal('show');
    }

    getBodyContent() {
        const design = this.visualizer.design;
        const endgameReq = design.calculateEndgameProductionRequirements();
        const totalResources = design.calculateTotalResourceExtraction();

        let html = '<div class="mega-factory-controls">';
        
        // Toggle visualization
        html += '<div class="form-group">';
        html += '<div class="custom-control custom-switch">';
        html += '<input type="checkbox" class="custom-control-input" id="toggleMegaFactory" ' + (this.isVisible ? 'checked' : '') + '>';
        html += '<label class="custom-control-label" for="toggleMegaFactory">Show Mega Factory Visualization</label>';
        html += '</div>';
        html += '</div>';

        // Factory overview
        html += '<h6>Factory Overview</h6>';
        html += '<p>This mega factory design covers the entire Satisfactory map and is optimized to produce all endgame requirements efficiently.</p>';
        
        // Endgame requirements
        html += '<h6>Space Elevator Phase 5 Requirements</h6>';
        html += '<table class="table table-sm">';
        html += '<thead><tr><th>Item</th><th>Required</th><th>Production Rate</th></tr></thead>';
        html += '<tbody>';
        html += `<tr><td>Assembly Director System</td><td>${design.endgameRequirements.assemblyDirectorSystem}</td><td>${endgameReq.assemblyDirectorSystemRate.toFixed(2)}/min</td></tr>`;
        html += `<tr><td>Magnetic Field Generator</td><td>${design.endgameRequirements.magneticFieldGenerator}</td><td>${endgameReq.magneticFieldGeneratorRate.toFixed(2)}/min</td></tr>`;
        html += `<tr><td>Nuclear Pasta</td><td>${design.endgameRequirements.nuclearPasta}</td><td>${endgameReq.nuclearPastaRate.toFixed(2)}/min</td></tr>`;
        html += `<tr><td>Thermal Propulsion Rocket</td><td>${design.endgameRequirements.thermalPropulsionRocket}</td><td>${endgameReq.thermalPropulsionRocketRate.toFixed(2)}/min</td></tr>`;
        html += '</tbody></table>';

        // Resource extraction
        html += '<h6>Total Resource Extraction (items/min)</h6>';
        html += '<div class="row">';
        html += '<div class="col-md-6">';
        html += '<table class="table table-sm">';
        html += '<tbody>';
        Object.entries(totalResources).slice(0, 6).forEach(([resource, rate]) => {
            html += `<tr><td>${this.formatResourceName(resource)}</td><td>${rate.toFixed(0)}/min</td></tr>`;
        });
        html += '</tbody></table>';
        html += '</div>';
        html += '<div class="col-md-6">';
        html += '<table class="table table-sm">';
        html += '<tbody>';
        Object.entries(totalResources).slice(6).forEach(([resource, rate]) => {
            html += `<tr><td>${this.formatResourceName(resource)}</td><td>${rate.toFixed(0)}/min</td></tr>`;
        });
        html += '</tbody></table>';
        html += '</div>';
        html += '</div>';

        // Factory zones
        html += '<h6>Factory Zones</h6>';
        html += '<div class="accordion" id="factoryZones">';
        Object.entries(design.factoryZones).forEach(([zoneId, zone], index) => {
            html += `<div class="card">`;
            html += `<div class="card-header" id="heading${zoneId}">`;
            html += `<h2 class="mb-0">`;
            html += `<button class="btn btn-link ${index > 0 ? 'collapsed' : ''}" type="button" data-toggle="collapse" data-target="#collapse${zoneId}">`;
            html += `${zone.name}`;
            html += `</button></h2></div>`;
            html += `<div id="collapse${zoneId}" class="collapse ${index === 0 ? 'show' : ''}" data-parent="#factoryZones">`;
            html += `<div class="card-body">`;
            html += `<p>${zone.description}</p>`;
            html += `<strong>Primary Resources:</strong> ${zone.primaryResources.join(', ')}<br>`;
            html += `<strong>Production:</strong> ${zone.production.join(', ')}<br>`;
            html += `<strong>Location:</strong> X: ${zone.coordinates.x}, Y: ${zone.coordinates.y}`;
            html += `</div></div></div>`;
        });
        html += '</div>';

        // Build order
        html += '<h6 class="mt-3">Optimal Build Order</h6>';
        html += '<ol>';
        design.getOptimalBuildOrder().forEach(phase => {
            html += `<li><strong>${phase.name}</strong><ul>`;
            phase.tasks.forEach(task => {
                html += `<li>${task}</li>`;
            });
            html += '</ul></li>';
        });
        html += '</ol>';

        html += '</div>';

        return html;
    }

    formatResourceName(resource) {
        return resource.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    bindEvents() {
        const self = this;

        // Toggle visualization
        $('#toggleMegaFactory').on('change', function() {
            self.isVisible = $(this).is(':checked');
            if (!self.visualizer.initialized && self.isVisible) {
                self.visualizer.initialize();
                self.visualizer.initialized = true;
            }
            self.visualizer.toggle(self.isVisible);
        });

        // Export design
        $('#exportMegaFactoryDesign').on('click', function() {
            const design = self.visualizer.exportDesign();
            const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mega-factory-design.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            self.baseLayout.notify('Mega Factory design exported successfully!', 'success');
        });
    }
}