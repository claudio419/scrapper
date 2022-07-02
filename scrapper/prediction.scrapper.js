const fs = require('fs');

let json = null;

if (fs.existsSync('../output/testVisible03_07.json')) {
    json = require('../output/testVisible03_07.json');
}

//const json = require('../output/Example.json');
Feature('Start Prediction for SoccerStats').tag('@prediction');

Scenario('Prediction', async ({ I, clientPage, predictionPage}) => {
    //const leagues = await clientPage.getAllLeagues();
    predictionPage.predictResultByLeagues(json);
});








