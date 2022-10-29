class predictionBase {
    constructor(
        homeGeneralFixedPercentageForWinning,
        homeGeneralFixedPercentageForLoosing,
        awayGeneralFixedPercentageForWinning,
        awayGeneralFixedPercentageForLoosing,
        homeFixedPercentageForWinning,
        homeFixedPercentageForLoosing,
        awayFixedPercentageForWinning,
        awayFixedPercentageForLoosing,
        filterNumber
    ) {
        this.homeGeneralFixedPercentageForWinning = homeGeneralFixedPercentageForWinning;
        this.homeGeneralFixedPercentageForLoosing = homeGeneralFixedPercentageForLoosing;
        this.awayGeneralFixedPercentageForWinning = awayGeneralFixedPercentageForWinning;
        this.awayGeneralFixedPercentageForLoosing = awayGeneralFixedPercentageForLoosing;


        this.homeFixedPercentageForWinning = homeFixedPercentageForWinning;
        this.homeFixedPercentageForLoosing = homeFixedPercentageForLoosing;
        this.awayFixedPercentageForWinning = awayFixedPercentageForWinning;
        this.awayFixedPercentageForLoosing = awayFixedPercentageForLoosing;
        this.filterNumber                  = filterNumber;
        this.minGamePlayed = 3;// use 3 because it calculate 3 * 2 (home and away)
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

                if (parseInt(match.homeTeam.gamePlayed) < this.minGamePlayed) { // use 3 because it calculate 3 * 2 (home and away)
                    return;
                }

                if (!match) {
                    return;
                }

                const calculateMatch = this.calculateMatch(league, match);

                if (!calculateMatch) {
                    return;
                }

                //console.log(calculateMatch);
                //return;
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

        //console.log('league.firstGoalStats', league.firstGoalStats.firstGoalStatsTable);

        if (league.firstGoalStats>0) {
            //const homeFirstGoalStats = this.getFirstGoalStats(match.homeTeam.name, league.firstGoalStats.firstGoalStatsTable);
        }
        //const homeFirstGoalStats = this.getFirstGoalStats(match.homeTeam.name, league.firstGoalStats.firstGoalStatsTable);

        return {
            "league": league.league,
            "filtered":filtered,
            "generalResultHomeAway":generalResultHomeAway,
            "firstGoalStats": {
                /*'home': {
                    'generalScored': 'test',
                    'scoreFirst': 'test',
                    'noGoal': 'test',
                    'concededFirst': 'test',
                },
                'away': {
                    'generalScored': 'test',
                    'scoreFirst': 'test',
                    'noGoal': 'test',
                    'concededFirst': 'test',
                },*/
            }
        }
    }

    /* Return home and away general table */
    getHomeAwayGeneralTable(league, match) {
        const homeTeamName = match.homeTeam.name;
        const awayTeamName = match.awayTeam.name;

        if (!homeTeamName || !awayTeamName) {
            console.log('Error by team name');
            console.log('homeTeamName:',homeTeamName,'awayTeamName:', awayTeamName);
            return;
        }
        const homeHomeResult = this.getTableByName(league.homeTable, homeTeamName);
        const homeAwayResult = this.getTableByName(league.awayTable, homeTeamName);



        const awayHomeResult = this.getTableByName(league.homeTable, awayTeamName);
        const awayAwayResult = this.getTableByName(league.awayTable, awayTeamName);

        if (!homeHomeResult && !homeAwayResult) {
            console.log('home result or away result not found');
            console.log(league.homeTable);
            console.log('-aca???-', league.league,'-Team:', match.homeTeam.name);
            return;
        }

        if (!awayHomeResult && !awayAwayResult) {
            console.log('awayTeamName', awayTeamName);
            console.log(league.homeTable, league.awayTable);
            console.log(awayHomeResult,awayAwayResult);
            console.log(league.league, match.awayTeam.name);
            return;
        }

        const homeGeneralResult = this.calculateHomeAwayTableResult(homeHomeResult, homeAwayResult);
        const awayGeneralResult = this.calculateHomeAwayTableResult(awayHomeResult, awayAwayResult);

        if (!homeHomeResult || !awayAwayResult) {
            return;
        }
        const homeResult = this.calculateResult(homeHomeResult)
        const awayResult = this.calculateResult(awayAwayResult)

        return {
            "homeGeneralResult": homeGeneralResult,
            "awayGeneralResult": awayGeneralResult,
            "homeResult": homeResult,
            "awayResult": awayResult,
        }

    }

    /*return object from table by name*/
    getTableByName(table, name) {

        return table.find(
            element => element.teamName.replaceAll('-', '').replaceAll('`', '').replaceAll("'", '').replaceAll(' ', '').replaceAll('-', '') === name.replaceAll('-', '').replaceAll('`', '').replaceAll("'", '').replaceAll(' ', '').replaceAll('-', '')
        );

    }

    /* calculate General Table by table home and table away*/
    calculateHomeAwayTableResult(homeHomeResult, awayHomeResult) {
        const teamName = homeHomeResult.teamName;
        const gamePlayed = parseInt(homeHomeResult.gamePlayed) + parseInt(awayHomeResult?.gamePlayed);
        const winning = parseInt(homeHomeResult.winning) + parseInt(awayHomeResult?.winning);
        const draw = parseInt(homeHomeResult.draw) + parseInt(awayHomeResult?.draw);
        const loosing = parseInt(homeHomeResult.loosing) + parseInt(awayHomeResult?.loosing);
        const winningAvg =  this.getPercentage(winning, gamePlayed);
        const drawAvg = this.getPercentage(draw, gamePlayed);
        const loosingAvg = this.getPercentage(loosing, gamePlayed);
        return this.buildResult(teamName, gamePlayed, winning, draw, loosing, winningAvg, drawAvg, loosingAvg);
    }

    getPercentage(numb1, numb2) {
        return ((parseInt(numb1) / parseInt(numb2)) * 100).toFixed(2);
    }

    /*return object*/
    buildResult(teamName, gamePlayed, winning, draw, loosing, winningAvg, drawAvg, loosingAvg) {
        return {
            "teamName": teamName,
            "gamePlayed": gamePlayed,
            "winning": winning,
            "draw": draw,
            "loosing": loosing,
            "winningPercentage": winningAvg,
            "drawPercentage": drawAvg,
            "loosingPercentage": loosingAvg
        }
    }

    calculateResult(table) {
        try {
            const winningAvg =  this.getPercentage(table?.winning.replaceAll('\n<td align=\"center\"> \n<font color=\"green\">\n', ''), table?.gamePlayed.replaceAll('\n<td align=\"center\"> \n<font color=\"green\">\n', ''));
            const drawAvg = this.getPercentage(table?.draw, table?.gamePlayed);
            const loosingAvg = this.getPercentage(table?.loosing, table?.gamePlayed);

            return this.buildResult(table.teamName, table.gamePlayed, table.winning, table.draw, table.loosing, winningAvg, drawAvg, loosingAvg);
        } catch (e) {
            console.log('It break on: ');
            console.log(table);
            console.log(e);
        }

    }

    /* hier we apply the formel from excel for 70% */
    applyFilter(generalResultHomeAway) {

        // calculated general result
        const homeGeneralWinningAvg = (generalResultHomeAway.homeGeneralResult.winningPercentage - this.homeGeneralFixedPercentageForWinning).toFixed(2);
        const homeGeneralLoosingAvg = (this.homeGeneralFixedPercentageForLoosing - generalResultHomeAway.homeGeneralResult.loosingPercentage).toFixed(2);
        const awayGeneralWinningAvg = (this.awayGeneralFixedPercentageForWinning - generalResultHomeAway.awayGeneralResult.winningPercentage).toFixed(2);
        const awayGeneralLoosingAvg = (generalResultHomeAway.awayGeneralResult.loosingPercentage - this.awayGeneralFixedPercentageForLoosing).toFixed(2);
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

    applyDecision(number) {

        if (number < -10.0) {
            return -1;
        }
        if (number < 0.0 && number >= -10.0) {
            return 0;
        }

        return 1;
    }

    getCsvByJson(predictionsJson) {
        let csv = [];

        predictionsJson.forEach((prediction) => {
            if (parseFloat(prediction.generalResultHomeAway.homeGeneralResult.winningPercentage) < this.filterNumber) {
                return;
            }
            const textMacht = this.getCsvText(prediction);
            csv.push(textMacht.join(' '));
        });

        return csv;
    }

    getCsvText(prediction) {
        let txt = [];

        const homeGeneral = prediction.filtered.general.home;
        const homeGeneralResult = prediction.generalResultHomeAway.homeGeneralResult;
        const awayGeneral = prediction.filtered.general.away;
        const awayGeneralResult = prediction.generalResultHomeAway.awayGeneralResult;

        const home = prediction.filtered.homeAway.home;
        const homeResult = prediction.generalResultHomeAway.homeResult;
        const away = prediction.filtered.homeAway.away;
        const awayResult = prediction.generalResultHomeAway.awayResult;

        //Fisrt Goal
        let homeWinningAverage = 0;
        let awayWinningAverage = 0;
        let awayConcedeFirstAverage = 0;
        let homeConcedeFirstAverage = 0;
        let calculatedText = [];

        /*try {
            if (prediction.firstGoalStats && prediction.firstGoalStats) {
                const totalHomeGoalFirst = parseInt(prediction.firstGoalStats.homeScoreFirst) + parseInt(prediction.firstGoalStats.homeNoGoal) + parseInt(prediction.firstGoalStats.homeConcededFirst);
                const totalAwayGoalFirst = parseInt(prediction.firstGoalStats.awayScoreFirst) + parseInt(prediction.firstGoalStats.awayNoGoal) + parseInt(prediction.firstGoalStats.awayConcededFirst);

                homeWinningAverage = ((parseInt(prediction.firstGoalStats.homeScoreFirst) / totalHomeGoalFirst) * 100).toFixed(2) ;
                awayWinningAverage = ((parseInt(prediction.firstGoalStats.awayScoreFirst) / totalAwayGoalFirst) * 100).toFixed(2);

                const homeNoGoalAverage = ((parseInt(prediction.firstGoalStats.homeNoGoal) / totalHomeGoalFirst) * 100).toFixed(2);
                const awayNoGoalAverage = ((parseInt(prediction.firstGoalStats.awayNoGoal) / totalAwayGoalFirst) * 100).toFixed(2);

                homeConcedeFirstAverage = ((parseInt(prediction.firstGoalStats.homeConcededFirst) / totalHomeGoalFirst) * 100).toFixed(2);
                awayConcedeFirstAverage = ((parseInt(prediction.firstGoalStats.awayConcededFirst) / totalAwayGoalFirst) * 100).toFixed(2);
                // -------------------------------------------------

                calculatedText.push('First Goal',';', 'local?',';', 'ScoreFirst',';', 'NoGoal',';', 'ConcededFirst',';', 'WinningAverage', ';', 'NoGoalAverage', ';','ConcedeFirstAverage', '\n');
                calculatedText.push(prediction.team,';', totalHomeGoalFirst,';', parseInt(prediction.firstGoalStats.homeScoreFirst),';', parseInt(prediction.firstGoalStats.homeNoGoal),';', parseInt(prediction.firstGoalStats.homeConcededFirst),';', homeWinningAverage, ';', homeNoGoalAverage, ';', homeConcedeFirstAverage, '\n');
                calculatedText.push(prediction.team,';', totalAwayGoalFirst,';', parseInt(prediction.firstGoalStats.awayScoreFirst),';', parseInt(prediction.firstGoalStats.awayNoGoal),';', parseInt(prediction.firstGoalStats.awayConcededFirst), ';',awayWinningAverage, ';', awayNoGoalAverage, ';', awayConcedeFirstAverage, '\n');
                calculatedText.push('\n');
            }
        } catch (e) {
            console.log('//Fisrt Goal');
        }*/

        txt.push(prediction.filtered.profil, ';' , '\n');
        txt.push(prediction.league, ';' , '\n');
        txt.push('General', ';', '\n');
        txt.push('Name', ';','Winning', ';','Loosing', ';','', ';', 'fixedWin%',';','fixedLoose%', ';', 'winnDecision', ';','looseDecision', ';','WinnCalculated', ';','LooseCalculated', ';','', ';','', ';','GP', ';','W', ';','D', ';','L', ';','\n');
        txt.push(homeGeneral.teamName, ';',homeGeneral.winning, ';',homeGeneral.loosing, ';','', ';',homeGeneral.fixedPercentageForWinning, ';',homeGeneral.fixedPercentageForLoosing, ';',homeGeneral.winningAvgDecision, ';',homeGeneral.loosingAvgDecision, ';',homeGeneral.winningAvg, ';',homeGeneral.loosingAvg, ';','', ';','', ';',homeGeneralResult.gamePlayed, ';',homeGeneralResult.winning, ';',homeGeneralResult.draw, ';',homeGeneralResult.loosing, '\n');
        txt.push(awayGeneral.teamName, ';',awayGeneral.winning, ';',awayGeneral.loosing, ';','', ';',awayGeneral.fixedPercentageForWinning, ';',awayGeneral.fixedPercentageForLoosing, ';',awayGeneral.winningAvgDecision, ';',awayGeneral.loosingAvgDecision, ';',awayGeneral.winningAvg, ';',awayGeneral.loosingAvg, ';','', ';','', ';',awayGeneralResult.gamePlayed, ';',awayGeneralResult.winning, ';',awayGeneralResult.draw, ';',awayGeneralResult.loosing, '\n');
        txt.push('\n');
        txt.push('Home-Away', ';', '\n');
        txt.push('Name', ';','Winning', ';','Loosing', ';','', ';', 'fixedWin%',';','fixedLoose%', ';', 'winnDecision', ';','looseDecision', ';','WinnCalculated', ';','LooseCalculated', ';','', ';','', ';','GP', ';','W', ';','D', ';','L', ';','\n');
        txt.push(home.teamName, ';',home.winning, ';',home.loosing, ';','', ';',home.fixedPercentageForWinning, ';',home.fixedPercentageForLoosing, ';',home.winningAvgDecision, ';',home.loosingAvgDecision, ';',home.winningAvg, ';',home.loosingAvg, ';','', ';','', ';',homeResult.gamePlayed, ';',homeResult.winning, ';',homeResult.draw, ';',homeResult.loosing, '\n');
        txt.push(away.teamName, ';',away.winning, ';',away.loosing, ';','', ';',away.fixedPercentageForWinning, ';',away.fixedPercentageForLoosing, ';',away.winningAvgDecision, ';',away.loosingAvgDecision, ';',away.winningAvg, ';',away.loosingAvg, ';','', ';','', ';',awayResult.gamePlayed, ';',awayResult.winning, ';',awayResult.draw, ';',awayResult.loosing, '\n');
        txt.push('\n');

        if (calculatedText.length > 0) {
            txt.push(calculatedText);
        }

        txt.push('-----', ';','-----', ';','-----', ';','', ';','-----', ';','-----', ';','-----', ';','-----', ';','-----', ';','-----', ';','', ';','', ';','-----', ';','-----', ';','-----', ';','-----', '\n');
        txt.push('-----', ';','-----', ';','-----', ';','', ';','-----', ';','-----', ';','-----', ';','-----', ';','-----', ';','-----', ';','', ';','', ';','-----', ';','-----', ';','-----', ';','-----', '\n');
        txt.push('\n');

        return txt;
    }
    getPercentageOfVictoryPlusPercentageOfLoosingAcrossTwo(data1, data2) {
        const a = data2.replace('%', '');
        const b = data1.replace('%', '');
        const sum = parseFloat(a)+parseFloat(b)
        return (sum/2);
    }

    getFirstGoalStats(name, firstGoalStatsTable) {

        console.log('firstGoalStatsTable', firstGoalStatsTable);
        const team = this.getFirstGoalByName(firstGoalStatsTable, name);

        console.log('team',team);

    }

    /*return object from table by name*/
    getFirstGoalByName(table, name) {

        return table.find(
            element => element.team.replaceAll('`', '').replaceAll("'", '').replaceAll(' ', '').replaceAll('-', '') === name.replaceAll('`', '').replaceAll("'", '').replaceAll(' ', '').replaceAll('-', '')
        );
    }
}

module.exports = predictionBase;
