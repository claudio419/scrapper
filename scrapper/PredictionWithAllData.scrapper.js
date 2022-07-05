const fs = require('fs');

let json1 = require('../output/testVisible03_07.json');
let json2 = require('../output/testHidden03_07.json');


Feature('test').tag('@test');


Scenario('Test', async ({ I, clientPage, predictionPage}) => {
    const json =[].concat(json1, json2);
    console.log('json', json);
    console.log(json1, json2);
    predictionPage.predictResultByLeagues(json1);
    //const leagues = await clientPage.getAllLeagues();
    //console.log(leagues);
});
