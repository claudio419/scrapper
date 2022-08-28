const base = require("./predictionBase");

class prediction70away extends base {
    constructor() {
        super(35, 25, 70, 15,22,40, 55, 20, 70.00);
    }

    predictResultByLeagues(arrayLeagues) {

        const predictionMatches = [];
        arrayLeagues.forEach((league) => {
            if (!league.matches.length) {
                return;
            }

            if (league.league.search('Women') >= 0) {  //Women will be exclude
                return;
            }

            league.matches.forEach((match) => {

                if (parseInt(match.homeTeam.gamePlayed) < 6) {
                    return;
                }

                if (!match) {
                    return;
                }

                const calculateMatch = this.calculateMatch(league, match);

                if (!calculateMatch) {
                    return;
                }
                predictionMatches.push(calculateMatch);
            });
        });

        return predictionMatches;

    }

    calculateMatch(league, match) {
        const generalResultHomeAway = this.getHomeAwayGeneralTable(league, match);

        if (!generalResultHomeAway) {
            return;
        }

        const filtered = this.applyFilter(generalResultHomeAway);

        if (!filtered) {
            return;
        }

        return {
            "league": league.league,
            "filtered":filtered,
            "generalResultHomeAway":generalResultHomeAway,
        }
    }

    /* hier we apply the formel from excel for 70% */
    applyFilter(generalResultHomeAway) {

        // calculated general result
        const homeGeneralWinningAvg = (this.homeGeneralFixedPercentageForWinning - generalResultHomeAway.homeGeneralResult.winningPercentage).toFixed(2);
        const homeGeneralLoosingAvg = (generalResultHomeAway.homeGeneralResult.loosingPercentage-this.homeGeneralFixedPercentageForLoosing).toFixed(2);
        const awayGeneralWinningAvg = (generalResultHomeAway.awayGeneralResult.winningPercentage - this.awayGeneralFixedPercentageForWinning).toFixed(2);
        const awayGeneralLoosingAvg = (this.awayGeneralFixedPercentageForLoosing - generalResultHomeAway.awayGeneralResult.loosingPercentage).toFixed(2);
        const homeGeneralWinningAvgDecision = this.applyDecision(homeGeneralWinningAvg);
        const homeGeneralLoosingAvgDecision = this.applyDecision(homeGeneralLoosingAvg);
        const awayGeneralWinningAvgDecision = this.applyDecision(awayGeneralWinningAvg);
        const awayGeneralLoosingAvgDecision = this.applyDecision(awayGeneralLoosingAvg);

        //calculated result
        const homeWinningAvg = (generalResultHomeAway.homeResult.winningPercentage - this.homeFixedPercentageForWinning).toFixed(2);
        const homeLoosingAvg = (this.homeFixedPercentageForLoosing - generalResultHomeAway.homeResult.loosingPercentage).toFixed(2);
        const awayWinningAvg = (this.awayFixedPercentageForWinning - generalResultHomeAway.awayResult.winningPercentage).toFixed(2);
        const awayLoosingAvg = (generalResultHomeAway.awayResult.loosingPercentage - this.awayFixedPercentageForLoosing).toFixed(2);
        const homeWinningAvgDecision = this.applyDecision(homeWinningAvg);
        const homeLoosingAvgDecision = this.applyDecision(homeLoosingAvg);
        const awayWinningAvgDecision = this.applyDecision(awayWinningAvg);
        const awayLoosingAvgDecision = this.applyDecision(awayLoosingAvg);

        if (
            homeWinningAvgDecision < 0 ||
            homeLoosingAvgDecision < 0 ||
            awayWinningAvgDecision < 0 ||
            awayLoosingAvgDecision < 0 ||
            homeGeneralWinningAvgDecision < 0 ||
            homeGeneralLoosingAvgDecision < 0 ||
            awayGeneralWinningAvgDecision < 0 ||
            awayGeneralLoosingAvgDecision < 0
        ) {
            return;
        }

        return {
            "profil": 'Low Risk',
            "general": {
                "home": {
                    "teamName": generalResultHomeAway.homeGeneralResult.teamName,
                    "winning": generalResultHomeAway.homeGeneralResult.winningPercentage,
                    "loosing": generalResultHomeAway.homeGeneralResult.loosingPercentage,
                    "fixedPercentageForWinning":  this.homeGeneralFixedPercentageForWinning,
                    "fixedPercentageForLoosing": this.homeGeneralFixedPercentageForLoosing,
                    "winningAvg": homeGeneralWinningAvg,
                    "loosingAvg": homeGeneralLoosingAvg,
                    "winningAvgDecision": homeGeneralWinningAvgDecision,
                    "loosingAvgDecision": homeGeneralLoosingAvgDecision,
                },
                "away": {
                    "teamName": generalResultHomeAway.awayGeneralResult.teamName,
                    "winning": generalResultHomeAway.awayGeneralResult.winningPercentage,
                    "loosing": generalResultHomeAway.awayGeneralResult.loosingPercentage,
                    "fixedPercentageForWinning": this.awayGeneralFixedPercentageForWinning,
                    "fixedPercentageForLoosing": this.awayGeneralFixedPercentageForLoosing,
                    "winningAvg": awayGeneralWinningAvg,
                    "loosingAvg": awayGeneralLoosingAvg,
                    "winningAvgDecision": awayGeneralWinningAvgDecision,
                    "loosingAvgDecision": awayGeneralLoosingAvgDecision,
                }
            },
            "homeAway": {
                "home": {
                    "teamName": generalResultHomeAway.homeGeneralResult.teamName,
                    "winning": generalResultHomeAway.homeResult.winningPercentage,
                    "loosing": generalResultHomeAway.homeResult.loosingPercentage,
                    "fixedPercentageForWinning":  this.homeFixedPercentageForWinning,
                    "fixedPercentageForLoosing": this.homeFixedPercentageForLoosing,
                    "winningAvg": homeWinningAvg,
                    "loosingAvg": homeLoosingAvg,
                    "winningAvgDecision":homeWinningAvgDecision,
                    "loosingAvgDecision":homeLoosingAvgDecision,
                },
                "away": {
                    "teamName": generalResultHomeAway.awayGeneralResult.teamName,
                    "winning": generalResultHomeAway.awayResult.winningPercentage,
                    "loosing": generalResultHomeAway.awayResult.loosingPercentage,
                    "fixedPercentageForWinning":  this.awayFixedPercentageForWinning,
                    "fixedPercentageForLoosing": this.awayFixedPercentageForLoosing,
                    "winningAvg": awayWinningAvg,
                    "loosingAvg": awayLoosingAvg,
                    "winningAvgDecision": awayWinningAvgDecision,
                    "loosingAvgDecision": awayLoosingAvgDecision,
                }
            }
        }

    }

    getCsvByJson(predictionsJson) {
        let csv = [];

        predictionsJson.forEach((prediction) => {
            if (parseFloat(prediction.generalResultHomeAway.awayGeneralResult.winningPercentage) < 70.00) {
                return;
            }
            const textMacht = this.getCsvText(prediction);
            csv.push(textMacht.join(' '));
        });

        return csv;
    }
}
module.exports = prediction70away;
