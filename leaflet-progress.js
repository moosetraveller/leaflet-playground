const progressControlStyle = `
    progress[value] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        
        border: none;

        min-width: 250px;
        width: 100%;
        height: 20px;
    }

    progress::-moz-progress-bar {
        background: #0063a6;
    }

    .leaflet-progress-container {
        background-color: #ffffff;
        padding: 0.5rem;
    }

    .leaflet-progress-container .progress-label {
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
`;

function injectProgressControlStyle() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = progressControlStyle;
    styleElement.dataset['inject'] = 'progress-control';
    document.getElementsByTagName('head')[0].appendChild(styleElement);
}

injectProgressControlStyle();

L.Control.Progress = L.Control.extend({
    
    onAdd: function(map) {

        this.containerElement = L.DomUtil.create('div', 'leaflet-progress-container');
        
        this.labelElement = L.DomUtil.create('div', 'progress-label', this.containerElement);
        this.progressElement = L.DomUtil.create('progress', 'progress-bar', this.containerElement);

        this.progressElement.value = 0;
        this.progressElement.max = 100;

        L.DomEvent.disableClickPropagation(this.containerElement);

        this.hide();

        return this.containerElement;

    },

    setLabel: function(label) {
        if (label) {
            this.labelElement.innerHTML = label;
            this.labelElement.hidden = false;
        }
        else {
            this.labelElement.hidden = true;
        }
    },

    reset: function(options) {

        this.progressElement.value = 0;

        if (options.show) {
            this.show();
        }

        if (options.label) {
            this.setLabel(`${options.label} ...`);
        }

    },

    setValue: function(value) {
        this.progressElement.value = value;
    },

    hide: function() {
        this.containerElement.hidden = true;
    },

    show: function() {
        this.containerElement.hidden = false;
    },

});

L.control.progress = function(options) {
    return new L.Control.Progress(options);
}