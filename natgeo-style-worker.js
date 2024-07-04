importScripts('https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js');

function calculateBoundaryArea(geojson, bufferRadius, unit) {

    const features = geojson.features;

    const result = [];

    const totalSteps = features.length;

    for (const [index, feature] of features.entries()) {

        const step = index+1;

        const nonBoundaryArea = turf.buffer(feature, -Math.abs(bufferRadius), {
            unit: unit || 'degrees',
        });

        if (!nonBoundaryArea) {
            result.push(feature);
            self.postMessage({ step, totalSteps });
            continue;
        }

        const boundaryArea = turf.difference(turf.featureCollection([feature, nonBoundaryArea]));
        boundaryArea.properties = feature.properties;

        result.push(boundaryArea);
        self.postMessage({ step, totalSteps });

    }

    return result;

}


self.onmessage = (event) => {
    const { geojson, bufferRadius, unit } = event.data;
    const result = calculateBoundaryArea(geojson, bufferRadius, unit);
    self.postMessage({ result });
};