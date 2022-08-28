const base = require("./predictionBase");

class prediction60 extends base {
    constructor() {
        super(60, 20, 35, 30,60,20, 35, 25, 60);
    }

    getCsvByJson(predictionsJson) {
        let csv = [];

        predictionsJson.forEach((prediction) => {
            if (
                parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) < 60.00 ||
                parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) >= 70.00
            ) {
                return;
            }
            const textMacht = this.getCsvText(prediction);
            csv.push(textMacht.join(' '));
        });

        return csv;
    }
}
module.exports = prediction60;
