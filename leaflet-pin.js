const pinIconMarkerStyle = `
    .pin-icon-marker {
        --pin-icon-marker-color: #424874; /* default color */
        background-color: var(--pin-icon-marker-color);
        width: 1.5rem;
        height: 1.5rem;
        display: block;
        left: -0.75rem;
        top: -0.75rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF;
    }
`;

function injectPinIconMarkerStyle() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = pinIconMarkerStyle;
    styleElement.dataset['inject'] = 'pin-icon-marker';
    document.getElementsByTagName('head')[0].appendChild(styleElement);
}

injectPinIconMarkerStyle();

function createPinIconHtml(color) {
    return `<span class="pin-icon-marker" 
                  style="--pin-icon-marker-color: ${color};" />`;
}

L.PinIcon = L.DivIcon.extend({ 

    options: {
        className: "marker-container",
        iconAnchor: [0, 24],
        popupAnchor: [0, -36],
    },

    initialize: function(options) {

        options = options || {};
        options.color = options.color || '#424874';
        options.html = createPinIconHtml(options.color);

        L.DivIcon.prototype.initialize.call(this, options);
        
    },

    getColor() {
        return this.options.color;
    },

});

L.pinIcon = function (options) {
    return new L.PinIcon(options);
}

L.PinIconMarker = L.Marker.extend({ 

    initialize: function(latlng, options) {

        options = options || {};
        options.icon = L.pinIcon({ color: options.color });

        L.Marker.prototype.initialize.call(this, latlng, options);

    },

    setRandomColor() {
        this.setColor(`#${Math.random().toString(16).slice(-6)}`);
    },

    setColor(color) {

        this.options.color = color;

        const icon = this.getIcon();
        icon.options.color = color;
        icon.options.html = createPinIconHtml(color);
        
        const iconElement = this.getElement();
        iconElement.innerHTML = icon.options.html;

    },

    getColor() {
        return this.getIcon().getColor();
    },

});

L.pinIconMarker = function (latlng, options) {
    return new L.PinIconMarker(latlng, options);
}

