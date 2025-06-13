/* global L */

L.Control.FactoryGenerator = L.Control.extend({
    options: {
        position: 'topleft'
    },

    initialize: function(options)
    {
        L.setOptions(this, options);
        this.baseLayout = options.baseLayout;
    },

    onAdd: function(map)
    {
        let container = L.DomUtil.create('div', 'leaflet-control-factory-generator leaflet-bar');
        
        this.link = L.DomUtil.create('a', 'leaflet-control-factory-generator-button', container);
        this.link.href = '#';
        this.link.title = 'Générer une usine optimisée';
        this.link.innerHTML = '<i class="fas fa-industry"></i>';
        this.link.style.cssText = `
            background: #fff;
            border-radius: 4px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            text-decoration: none;
            cursor: pointer;
            box-shadow: 0 1px 5px rgba(0,0,0,0.65);
            border-bottom: 1px solid #ccc;
        `;
        
        L.DomEvent.on(this.link, 'click', this._onClick, this);
        L.DomEvent.disableClickPropagation(container);
        
        return container;
    },

    onRemove: function(map)
    {
        L.DomEvent.off(this.link, 'click', this._onClick, this);
    },

    _onClick: function(e)
    {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        
        this.openFactoryGenerator();
    },

    async openFactoryGenerator()
    {
        if(!this.baseLayout.saveGameParser || !this.baseLayout.saveGameParser.saveGameData)
        {
            alert('Veuillez charger une sauvegarde avant de générer une usine.');
            return;
        }
        
        const Modal_Statistics_FactoryGenerator = (await import('../Modal/Statistics/FactoryGenerator.js')).default;
        let factoryGenerator = new Modal_Statistics_FactoryGenerator({
            baseLayout: this.baseLayout
        });
        
        await factoryGenerator.showModal();
    }
});