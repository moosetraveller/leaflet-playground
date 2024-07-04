importScripts('https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js');

function findAdjacentFeatures(feature, features) {
    const featureId = feature.properties.id;
    return features
        .filter(f => f.properties.id !== featureId && !turf.booleanDisjoint(feature, f));
}

function shuffle(array) {
    // not a good algorithm but for showcase purpose good enough
    array.sort(() => Math.random() - 0.5);
}

function colorCodeFeatures(geojson, colors, randomized) {

    const features = [...geojson.features];

    if (randomized) {
        shuffle(features);
    }
    
    for (const [index, feature] of features.entries()) {

        let adjacentFeatures = findAdjacentFeatures(feature, features);

        let usedColors = adjacentFeatures
            .map(feature => feature?.properties?.color);

        let nextColor = colors
            .find(color => !usedColors.includes(color));

        feature.properties.color = nextColor;
        
        self.postMessage({ 
            step: index+1,
            totalSteps: features.length,
        });

    }

    return geojson;

}

self.onmessage = (event) => {
    const { geojson, colors, randomized } = event.data;
    const result = colorCodeFeatures(geojson, colors, randomized);
    self.postMessage({ result });
};