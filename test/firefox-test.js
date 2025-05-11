/**
 * Test to check if the marker is displayed at the correct location
 * when a canton is clicked on the map.
 * 
 * This test was written to answer a question on StackOverflow:
 * https://stackoverflow.com/q/79601421/42659
 */

const { Builder, By, until } = require('selenium-webdriver');

const firefox = require('selenium-webdriver/firefox');

(async function testMarkerLocation() {

    let driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(new firefox.Options())
        .build();

    try {
        
        await driver.get(
            'https://moosetraveller.github.io/leaflet-playground');

        // wait until first boundary polygon is added to the map
        // this can take a while, so we use a longer timeout
        await driver.wait(
            until.elementLocated(
                By.css('.canton-boundary-polygon')
            ), 10000);
        
        // wait until all boundary polygons are added to the map
        await driver.sleep(1000);

        const polygon = await driver.findElement(
            By.css('[data-name="Bern"]'));
        await polygon.click();

        // wait until marker appears
        await driver.wait(
            until.elementLocated(
                By.css('.pin-icon-marker')
            ), 2000);

        const coordinates = await driver.executeScript(() => {

            const marker = document.querySelector('.pin-icon-marker');
            const bbox = marker.getBoundingClientRect();
            
            return {
                x: Math.round(bbox.left + bbox.width / 2),
                y: Math.round(bbox.top + bbox.height / 2)
            };

        });

        console.log('X/Y pixel coordinates of the marker:', coordinates);

    } 
    catch (err) {
        console.error('Test failed:', err);
    }
    finally {
        await driver.quit();
    }

})();