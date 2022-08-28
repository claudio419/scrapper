const fs = require("fs");
let nextThreePredictions = new DataTable(['date'])

const today = new Date();
const dayDateToday = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();

today.setDate(new Date().getDate()+1); // Tomorrow
const dayDateTomorrow = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();

today.setDate(new Date().getDate()+2); // After tomorrow
const dayDateafterTomorrow =  today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate();

today.setDate(new Date().getDate()+3); // After 3 days
const afterFourDay =  today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate();


nextThreePredictions.add([dayDateToday]);
nextThreePredictions.add([dayDateTomorrow]);
nextThreePredictions.add([dayDateafterTomorrow]);
nextThreePredictions.add([afterFourDay]);

Feature('Start Prediction new by percentage').tag('@newprediction');

Data(nextThreePredictions).Scenario('Prediction', async ({ I, current, predictionNewPage}) => {

    const json =JSON.parse(fs.readFileSync('./output/scrapperSoccerStats_' + current.date +'.json', 'utf8'));
    predictionNewPage.prediction70(json, current);
    predictionNewPage.prediction70away(json, current);
    predictionNewPage.prediction60(json, current);
    predictionNewPage.prediction60away(json, current);
    predictionNewPage.prediction50(json, current);
    predictionNewPage.prediction50away(json, current);
    predictionNewPage.prediction40(json, current);
    predictionNewPage.prediction30(json, current);
    predictionNewPage.prediction20(json, current);

});


