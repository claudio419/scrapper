const base = require("./predictionBase");

class prediction40 extends base {
    constructor() {
        super(42, 35, 35, 28,57,28, 15, 40, 40.00);
    }

    getCsvByJson(predictionsJson) {
        let csv = [];

        predictionsJson.forEach((prediction) => {
            if (
                parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) < 40.00 ||
                parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) >= 50.00
            ) {
                return;
            }
            const textMacht = this.getCsvText(prediction);
            csv.push(textMacht.join(' '));
        });

        return csv;
    }
}
module.exports = prediction40;
