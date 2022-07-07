const fs = require("fs");

let nextThreePredictions = new DataTable(['date'])

const today = new Date();
const dayDateToday = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();

today.setDate(new Date().getDate()+1); // Tomorrow
const dayDateTomorrow = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();

today.setDate(new Date().getDate()+2); // After tomorrow
const dayDateafterTomorrow =  today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate();

nextThreePredictions.add([dayDateToday]);
nextThreePredictions.add([dayDateTomorrow]);
nextThreePredictions.add([dayDateafterTomorrow]);

const json1 = require('../output/scrapperSoccerStats_2022_7_7.json');
Feature('Start Prediction for SoccerStats').tag('@prediction');

Data(nextThreePredictions).Scenario('Prediction', async ({ I, current, predictionPage}) => {

    if (fs.existsSync('./predictionMatches/prediction_for_' + current.date +'.csv')) {
        I.say('File exist ');
        return;
    }


    const json =JSON.parse(fs.readFileSync('./output/scrapperSoccerStats_' + current.date +'.json', 'utf8'));

    const predictions = predictionPage.predictResultByLeagues(json);

    try {

        if (!fs.existsSync('./predictionMatches/')) {
            fs.mkdirSync('./predictionMatches/');
        }

        fs.writeFileSync('./predictionMatches/prediction_for_' + current.date +'.csv', predictions, 'utf8');
    } catch (err) {
        console.error(err);
    }
});


