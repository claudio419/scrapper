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

today.setDate(new Date().getDate()+4); // After 4 days
const afterFiveDay =  today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate();

nextThreePredictions.add([dayDateToday]);
nextThreePredictions.add([dayDateTomorrow]);
nextThreePredictions.add([dayDateafterTomorrow]);
nextThreePredictions.add([afterFourDay]);
nextThreePredictions.add([afterFiveDay]);

Feature('Start Prediction for SoccerStats').tag('@prediction');

Data(nextThreePredictions).Scenario('Prediction', async ({ I, current, predictionPage}) => {

    if (!fs.existsSync('./tmp/league' + current.date )) {
        console.log('dir: ', './tmp/league' + current.date , ' dont exist');
        return;

    }

    const files = fs.readdirSync('./tmp/league' + current.date);


    let json = [];

    for (let x= 0; x<files.length; x++) {
        const league = JSON.parse(fs.readFileSync('./tmp/league' + current.date + '/' + files[x], 'utf8'));
        json.push(league[0]);
    }
    console.log(json.length);

    //const json = JSON.parse(fs.readFileSync('./output/scrapperSoccerStats_' + current.date +'.json', 'utf8'));

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


