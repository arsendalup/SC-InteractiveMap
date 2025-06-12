/**
 * Mega Factory Modal for Interactive Map
 * Provides UI controls for the mega factory visualization
 */

import MegaFactoryVisualizer from '../../MegaFactory/MegaFactoryVisualizer.js';
import OptimizedFactoryGenerator from '../../Spawn/OptimizedFactory.js';
import BaseLayout_Modal from '../../BaseLayout/Modal.js';

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
                        html += '<button type="button" class="btn btn-warning" id="generateOptimizedFactory" data-dismiss="modal">🏭 Générer Usine Optimisée</button>';
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
        html += '<div class="alert alert-info">';
        html += '<h6>🏭 Générateur d\'Usine Optimisée</h6>';
        html += '<p>Cet outil génère automatiquement une usine complète optimisée dans votre sauvegarde :</p>';
        html += '<ul>';
        html += '<li><strong>✅ Zéro perte :</strong> Production parfaitement équilibrée pour Phase 5</li>';
        html += '<li><strong>✅ Placement précis :</strong> Respecte la grille 1m x 1m du jeu</li>';
        html += '<li><strong>✅ Infrastructure complète :</strong> Fondations, bâtiments, transport, électricité</li>';
        html += '<li><strong>✅ Prêt à jouer :</strong> Directement utilisable dans le jeu</li>';
        html += '</ul>';
        html += '</div>';
        
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

        // Generate optimized factory
        $('#generateOptimizedFactory').on('click', function() {
            self.generateOptimizedFactory();
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

    /**
     * Generate optimized factory automatically in the save game
     */
    generateOptimizedFactory() {
        const self = this;
        
        // Show confirmation dialog
        BaseLayout_Modal.confirm({
            title: 'Générer Usine Optimisée',
            message: `
                <div class="alert alert-warning">
                    <h6>⚠️ Attention</h6>
                    <p>Cette action va générer automatiquement une usine complète optimisée pour l'endgame dans votre sauvegarde.</p>
                    <ul>
                        <li>✅ Production zéro perte pour les besoins Phase 5</li>
                        <li>✅ Placement automatique sur grille 1m x 1m</li>
                        <li>✅ Fondations, bâtiments, et transport inclus</li>
                        <li>✅ Connexions électriques automatiques</li>
                    </ul>
                    <p><strong>Êtes-vous sûr de vouloir continuer ?</strong></p>
                </div>
            `,
            callback: (confirmed) => {
                if (confirmed) {
                    self.startFactoryGeneration();
                }
            }
        });
    }

    /**
     * Start the factory generation process
     */
    startFactoryGeneration() {
        console.log('Starting optimized factory generation...');
        
        // Show progress modal
        this.showProgressModal();
        
        try {
            // Create the factory generator
            const generator = new OptimizedFactoryGenerator({
                baseLayout: this.baseLayout,
                design: this.visualizer.design,
                onProgress: (progress, message) => {
                    this.updateProgress(progress, message);
                },
                onComplete: (result) => {
                    this.onGenerationComplete(result);
                },
                onError: (error) => {
                    this.onGenerationError(error);
                }
            });
            
            // Start generation
            generator.generate();
            
        } catch (error) {
            console.error('Error starting factory generation:', error);
            this.onGenerationError(error);
        }
    }

    /**
     * Show progress modal
     */
    showProgressModal() {
        let html = '<div class="modal fade" id="modalGenerationProgress" tabindex="-1" data-backdrop="static">';
            html += '<div class="modal-dialog modal-lg">';
                html += '<div class="modal-content">';
                    html += '<div class="modal-header">';
                        html += '<h5 class="modal-title">🏭 Génération Usine Optimisée</h5>';
                    html += '</div>';
                    html += '<div class="modal-body">';
                        html += '<div class="progress mb-3" style="height: 30px;">';
                            html += '<div class="progress-bar progress-bar-striped progress-bar-animated" id="generationProgressBar" style="width: 0%">';
                                html += '<span id="generationProgressText">0%</span>';
                            html += '</div>';
                        html += '</div>';
                        html += '<div id="generationStatus">Initialisation...</div>';
                        html += '<div class="mt-3">';
                            html += '<h6>Étapes de génération :</h6>';
                            html += '<ul id="generationSteps">';
                                html += '<li id="step-validate">🔍 Validation des données...</li>';
                                html += '<li id="step-calculate">📊 Calculs de production...</li>';
                                html += '<li id="step-foundations">🏗️ Placement des fondations...</li>';
                                html += '<li id="step-buildings">🏭 Construction des bâtiments...</li>';
                                html += '<li id="step-transport">🚛 Réseaux de transport...</li>';
                                html += '<li id="step-power">⚡ Connexions électriques...</li>';
                                html += '<li id="step-finalize">✅ Finalisation...</li>';
                            html += '</ul>';
                        html += '</div>';
                    html += '</div>';
                    html += '<div class="modal-footer">';
                        html += '<button type="button" class="btn btn-secondary" id="cancelGeneration">Annuler</button>';
                    html += '</div>';
                html += '</div>';
            html += '</div>';
        html += '</div>';

        $('body').append(html);
        $('#modalGenerationProgress').modal('show');
        
        // Handle cancel button
        $('#cancelGeneration').on('click', () => {
            this.cancelGeneration();
        });
    }

    /**
     * Update progress display
     */
    updateProgress(progress, message) {
        $('#generationProgressBar').css('width', progress + '%');
        $('#generationProgressText').text(Math.round(progress) + '%');
        $('#generationStatus').text(message);
        
        // Update step indicators
        if (progress >= 10) $('#step-validate').addClass('text-success').prepend('✅ ');
        if (progress >= 25) $('#step-calculate').addClass('text-success').prepend('✅ ');
        if (progress >= 40) $('#step-foundations').addClass('text-success').prepend('✅ ');
        if (progress >= 60) $('#step-buildings').addClass('text-success').prepend('✅ ');
        if (progress >= 80) $('#step-transport').addClass('text-success').prepend('✅ ');
        if (progress >= 95) $('#step-power').addClass('text-success').prepend('✅ ');
        if (progress >= 100) $('#step-finalize').addClass('text-success').prepend('✅ ');
    }

    /**
     * Handle generation completion
     */
    onGenerationComplete(result) {
        $('#modalGenerationProgress').modal('hide');
        
        // Show success message
        BaseLayout_Modal.confirm({
            title: '🎉 Usine Générée avec Succès !',
            message: `
                <div class="alert alert-success">
                    <h6>Génération terminée !</h6>
                    <p>Votre usine optimisée a été créée avec succès :</p>
                    <ul>
                        <li><strong>Bâtiments placés :</strong> ${result.buildingsCount}</li>
                        <li><strong>Fondations :</strong> ${result.foundationsCount}</li>
                        <li><strong>Convoyeurs :</strong> ${result.conveyorsCount}m</li>
                        <li><strong>Production/min :</strong> Objectifs Phase 5 atteints</li>
                        <li><strong>Efficacité :</strong> Zéro perte garantie</li>
                    </ul>
                    <p>La carte va se recharger pour afficher votre nouvelle usine.</p>
                </div>
            `,
            callback: () => {
                // Refresh the map to show new buildings
                this.baseLayout.refreshMap();
            }
        });
    }

    /**
     * Handle generation error
     */
    onGenerationError(error) {
        $('#modalGenerationProgress').modal('hide');
        
        BaseLayout_Modal.alert(`
            <div class="alert alert-danger">
                <h6>❌ Erreur de Génération</h6>
                <p>Une erreur s'est produite lors de la génération de l'usine :</p>
                <p><code>${error.message}</code></p>
                <p>Veuillez réessayer ou vérifier que votre sauvegarde est valide.</p>
            </div>
        `);
    }

    /**
     * Cancel generation process
     */
    cancelGeneration() {
        // TODO: Implement cancellation logic
        $('#modalGenerationProgress').modal('hide');
        this.baseLayout.notify('Génération annulée', 'warning');
    }
}