const base = require("./predictionBase");

class prediction50 extends base {
    constructor() {
        super(50, 40, 45, 25,37,37, 42, 40, 50.00);
    }

    getCsvByJson(predictionsJson) {
        let csv = [];

        predictionsJson.forEach((prediction) => {
            if (
                parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) < 50.00 ||
                parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) >= 60.00
            ) {
                return;
            }
            const textMacht = this.getCsvText(prediction);
            csv.push(textMacht.join(' '));
        });

        return csv;
    }
}
module.exports = prediction50;
