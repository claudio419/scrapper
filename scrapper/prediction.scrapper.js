//const json = require('../output/testVisible.json');
const json = require('../output/testHidden.json');
//const json = require('../output/Example.json');
Feature('Start Prediction for SoccerStats').tag('@prediction');

Scenario('Prediction', async ({ I, clientPage, predictionPage}) => {

    //const leagues = await clientPage.getAllLeagues();
    predictionPage.predictResultByLeagues(json);
});








