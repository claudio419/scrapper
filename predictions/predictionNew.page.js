const fs = require("fs");
const prediction70 = require("../helper/prediction70");
const prediction70away = require("../helper/prediction70away");
const prediction60 = require("../helper/prediction60");
const prediction60away = require("../helper/prediction60away");
const prediction50 = require("../helper/prediction50");
const prediction50away = require("../helper/prediction50away");
const prediction40 = require("../helper/prediction40");
const prediction30 = require("../helper/prediction30");
const prediction20 = require("../helper/prediction20");
module.exports = {
    prediction70(json, current) {
        var prediction70Page = new prediction70();
        var predictions70Json = prediction70Page.predictResultByLeagues(json);

        const prediction70Csv = prediction70Page.getCsvByJson(predictions70Json);

        if (prediction70Csv.length > 0) {
            this.saveData(70, predictions70Json, prediction70Csv, current.date);
        }
    },

    prediction70away(json, current) {
        var prediction70awayPage = new prediction70away();
        var predictions70awayJson = prediction70awayPage.predictResultByLeagues(json);

        const prediction70awayCsv = prediction70awayPage.getCsvByJson(predictions70awayJson);

        if (prediction70awayCsv.length > 0) {
            this.saveData('70away', predictions70awayJson, prediction70awayCsv, current.date);
        }
    },

    prediction60(json, current) {
        var prediction60Page = new prediction60();
        var predictions60Json = prediction60Page.predictResultByLeagues(json);

        const prediction60Csv = prediction60Page.getCsvByJson(predictions60Json);

        if (prediction60Csv.length > 0) {
            this.saveData('60', predictions60Json, prediction60Csv, current.date);
        }
    },

    prediction60away(json, current) {
        var prediction60awayPage = new prediction60away();
        var predictions60awayJson = prediction60awayPage.predictResultByLeagues(json);

        const prediction60awayCsv = prediction60awayPage.getCsvByJson(predictions60awayJson);

        if (prediction60awayCsv.length > 0) {
            this.saveData('60away', predictions60awayJson, prediction60awayCsv, current.date);
        }
    },

    prediction50(json, current) {
        var prediction50Page = new prediction50();
        var predictions50Json = prediction50Page.predictResultByLeagues(json);

        const prediction50Csv = prediction50Page.getCsvByJson(predictions50Json);

        if (prediction50Csv.length > 0) {
            this.saveData('50', predictions50Json, prediction50Csv, current.date);
        }
    },

    prediction50away(json, current) {
        var prediction50awayPage = new prediction50away();
        var predictions50awayJson = prediction50awayPage.predictResultByLeagues(json);

        const prediction50awayCsv = prediction50awayPage.getCsvByJson(predictions50awayJson);

        if (prediction50awayCsv.length > 0) {
            this.saveData('50away', predictions50awayJson, prediction50awayCsv, current.date);
        }
    },
    prediction40(json, current) {
        var prediction40Page = new prediction40();
        var predictions40Json = prediction40Page.predictResultByLeagues(json);

        const prediction40Csv = prediction40Page.getCsvByJson(predictions40Json);

        if (prediction40Csv.length > 0) {
            this.saveData('40', predictions40Json, prediction40Csv, current.date);
        }
    },

    prediction30(json, current) {
        var prediction30Page = new prediction30();
        var predictions30Json = prediction30Page.predictResultByLeagues(json);

        const prediction30Csv = prediction30Page.getCsvByJson(predictions30Json);

        if (prediction30Csv.length > 0) {
            this.saveData('30', predictions30Json, prediction30Csv, current.date);
        }
    },

    prediction20(json, current) {
        var prediction20Page = new prediction20();
        var predictions20Json = prediction20Page.predictResultByLeagues(json);

        const prediction20Csv = prediction20Page.getCsvByJson(predictions20Json);

        if (prediction20Csv.length > 0) {
            this.saveData('20', predictions20Json, prediction20Csv, current.date);
        }
    },

    saveData(type, json, csv, currentDate) {
        try {

            if (!fs.existsSync('./predictionMatchesNew/json/')) {
                fs.mkdirSync('./predictionMatchesNew/');
                fs.mkdirSync('./predictionMatchesNew/json/');
            }

            if (!fs.existsSync('./predictionMatchesNew/csv/')) {
                fs.mkdirSync('./predictionMatchesNew/csv/');
            }

            fs.writeFileSync(
                './predictionMatchesNew/json/prediction' +  type + '_for_' + currentDate +'.json',
                JSON.stringify(json),
                'utf8'
            );

            fs.writeFileSync(
                './predictionMatchesNew/csv/prediction' + type + '_for_' + currentDate +'.csv',
                csv.join(' '),
                'utf8'
            );
        } catch (err) {
            console.error(err);
        }
    }
}
