const base = require("./predictionBase");

class prediction20 extends base {
    constructor() {
        super(35, 45, 20, 45,50,40, 25, 65, 20.00);
    }

    getCsvByJson(predictionsJson) {
        let csv = [];

        predictionsJson.forEach((prediction) => {
            if (
                parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) < 20.00 ||
                parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) >= 30.00
            ) {
                return;
            }
            const textMacht = this.getCsvText(prediction);
            csv.push(textMacht.join(' '));
        });

        return csv;
    }
}
module.exports = prediction20;
