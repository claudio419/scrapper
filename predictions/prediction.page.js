module.exports = {
    predictResultByLeagues(arrayLeagues) {
        const predictionMatches = [];
        for (let x = 0; x <= arrayLeagues.length; x++) {
        //for (let x = 0; x < 1; x++) {
            const league = arrayLeagues[x];

            if (!league) {
                continue;
            }

            const leagueName = league.league;
            const matches = league.matches;
            const homeTable = league.homeTable;
            const awayTable = league.awayTable;
            const firstGoalStats = league.firstGoalStats;

            const calculatedMatches = this.calculateMatches(leagueName, matches, homeTable, awayTable, firstGoalStats);
            predictionMatches.push(calculatedMatches);
        }

        return predictionMatches.join(' ');
    },
    calculateMatches(leagueName,matches, homeTable, awayTable, firstGoalStats) {
        const firstGoalStatsTable = firstGoalStats.firstGoalStatsTable;
        const homeOpeningGoalScoredTable = firstGoalStats.homeOpeningGoalScoredTable;
        const awayOpeningGoalScoredTable = firstGoalStats.awayOpeningGoalScoredTable;
        const homeOpeningGoalConcededTable = firstGoalStats.homeOpeningGoalConcededTable;
        const awayOpeningGoalConcededTable = firstGoalStats.awayOpeningGoalConcededTable;
        const calculateMatches = [];

        for (let x = 0; x < matches.length; x++) {
        //for (let x = 0; x < 1; x++) {
            const match = matches[x];
            const home = match?.homeTeam;
            const away = match?.awayTeam;
            if (!home || !away) {
                continue;
            }

            const homeGeneralResult = this.getGeneralResult(homeTable,awayTable);

            const homeFullData = this.extractData(home, homeGeneralResult, homeTable, firstGoalStatsTable,homeOpeningGoalScoredTable, homeOpeningGoalConcededTable);
            const awayFullData = this.extractData(away, homeGeneralResult, awayTable, firstGoalStatsTable,awayOpeningGoalScoredTable, awayOpeningGoalConcededTable);

            const homeTeamData = this.unifiedData(homeFullData);
            const awayTeamData = this.unifiedData(awayFullData);

            //Here it will apply pablos logic
            const matchCalculated = this.calculate(leagueName,homeTeamData, awayTeamData);
            calculateMatches.push(matchCalculated);
        }

        return calculateMatches.join(' ');
    },

    getAverage(operator1, operator2) {
        const result = parseFloat(((parseInt(operator1)/parseInt(operator2))*100).toString()).toFixed(2);
        return result + ('%');
    },

    extractData(team,homeGeneralResult, scoresTable, firstGoalStatsTable, OpeningGoalScoredTable, OpeningGoalConcededTable) {
        const teamName = team.name.replaceAll('-', ' ').replaceAll('\'', ' ').replaceAll('`', ' ').trim();
        team.generalResult = homeGeneralResult.filter( element => element.teamName.replaceAll('-', ' ').replaceAll('\'', ' ').replaceAll('`', ' ').trim() === teamName)[0];
        team.gameResult = scoresTable.filter( element => element.teamName.replaceAll('-', ' ').replaceAll('\'', ' ').replaceAll('`', ' ').trim() === teamName)[0];
        if (firstGoalStatsTable) {
            team.firstGoalStats = this.extractStatsByTeamName(teamName, firstGoalStatsTable);
        }

        if (OpeningGoalScoredTable) {
            team.openingGoalScored = this.extractStatsByTeamName(teamName, OpeningGoalScoredTable);
        }

        if (OpeningGoalConcededTable) {
            team.openingGoalConceded = this.extractStatsByTeamName(teamName, OpeningGoalConcededTable);
        }

        return team;
    },

    extractStatsByTeamName(teamName, goalStatsTable) {
        try {
            return goalStatsTable.filter( element => element.team.replaceAll('-', ' ').replaceAll('\'', ' ').replaceAll('`', ' ').trim() === teamName)[0];
        } catch (e) {
            console.log(teamName);
            return '';
        }

    },
    unifiedData(teamData) {

        try {
            const calculatedData = [];

            calculatedData.team = teamData.name;
            calculatedData.matchTime = teamData.matchTime;
            calculatedData.scope = teamData.scope;

            calculatedData.generalGamePlayed = teamData.generalResult?.gamePlayed;
            calculatedData.generalWinning = teamData.generalResult?.winning;
            calculatedData.generalDraw = teamData.generalResult?.draw;
            calculatedData.generalLoosing = teamData.generalResult?.loosing;
            calculatedData.generalWinningPerncetage = this.getAverage(teamData.generalResult.winning, teamData.generalResult.gamePlayed);
            calculatedData.generalDrawPerncetage = this.getAverage(teamData.generalResult.draw, teamData.generalResult.gamePlayed);
            calculatedData.generalLoosingPerncetage = this.getAverage(teamData.generalResult.loosing, teamData.generalResult.gamePlayed);

            calculatedData.gamePlayed = teamData.gameResult.gamePlayed;
            calculatedData.winning = teamData.gameResult.winning;
            calculatedData.draw = teamData.gameResult.draw;
            calculatedData.loosing = teamData.gameResult.loosing;
            calculatedData.winningPerncetage = this.getAverage(teamData.gameResult.winning, teamData.gameResult.gamePlayed);
            calculatedData.drawPerncetage = this.getAverage(teamData.gameResult.draw, teamData.gameResult.gamePlayed);
            calculatedData.loosingPerncetage = this.getAverage(teamData.gameResult.loosing, teamData.gameResult.gamePlayed);
            calculatedData.firstGoalStats = teamData.firstGoalStats;
            calculatedData.openingGoalScored = teamData.openingGoalScored;
            calculatedData.openingGoalConceded = teamData.openingGoalConceded;

            calculatedData.winningPercentageOfMatches = teamData.winningPercentageOfMatches;
            calculatedData.failedToScoreInPercentage = teamData.failedToScoreInPercentage;
            calculatedData.cleanSheetInPercentage = teamData.cleanSheetInPercentage;
            calculatedData.matchesWhereBothTeamsScoredInPercentage = teamData.matchesWhereBothTeamsScoredInPercentage;
            calculatedData.totalGoalsScoreAndConcededPerMatch = teamData.totalGoalsScoreAndConcededPerMatch;
            calculatedData.goalScoredPerMatch = teamData.goalScoredPerMatch;
            calculatedData.goalConcedePerMatch = teamData.goalsConcededPerMatch;

            return calculatedData;
        } catch (e) {
            console.log('It break on: ',teamData.name);
            console.log(teamData);
        }

    },
    getGeneralResult(homeTable, awayTable) {
        const generalResult = [];
        for(let x =0; x < homeTable.length; x++) {
            try {
                const result= [];
                result.teamName = homeTable[x].teamName;
                const awayResult =  awayTable.filter( element => element.teamName.replaceAll('-', ' ').replaceAll('\'', ' ').replaceAll('`', ' ').trim() === result.teamName.replaceAll('-', ' ').replaceAll('\'', ' ').replaceAll('`', ' ').trim())[0];

                result.gamePlayed = parseInt(homeTable[x].gamePlayed) + parseInt(awayResult.gamePlayed);
                result.winning = parseInt(homeTable[x].winning) + parseInt(awayResult.winning);
                result.draw = parseInt(homeTable[x].draw) + parseInt(awayResult.draw);
                result.loosing = parseInt(homeTable[x].loosing) + parseInt(awayResult.loosing);
                generalResult.push(result)
            } catch (e) {
                console.log('Error on getGeneralResult');
                console.log('x:', x, homeTable[x]);
                console.log('awayResult', awayResult)
            }


        }

        return generalResult;
    },
    calculate(leagueName, homeFullData, awayFullData) {
        const calculatedText = [];

        calculatedText.push(leagueName, ';', homeFullData.matchTime, '\n');

        // General Stats
        calculatedText.push('General Stats',';', 'W%',';', 'FailedToScore - FTS',';', 'Clean Sheet - CS',';', 'BTS',';', 'TotalGoalScore - TG', ';', 'GoalScorePerMatch - GF', ';', 'GoalCondecedPerMatch - GA', '\n');

        calculatedText.push(
            homeFullData.team,';',
            homeFullData.winningPercentageOfMatches,';',
            homeFullData.failedToScoreInPercentage,';',
            homeFullData.cleanSheetInPercentage,';',
            homeFullData.matchesWhereBothTeamsScoredInPercentage,';',
            homeFullData.totalGoalsScoreAndConcededPerMatch, ';',
            homeFullData.goalScoredPerMatch, ';',
            homeFullData.goalConcedePerMatch,
            '\n'
        );

        calculatedText.push(
            awayFullData?.team,';',
            awayFullData?.winningPercentageOfMatches,';',
            awayFullData?.failedToScoreInPercentage,';',
            awayFullData?.cleanSheetInPercentage,';',
            awayFullData?.matchesWhereBothTeamsScoredInPercentage,';',
            awayFullData?.totalGoalsScoreAndConcededPerMatch, ';',
            awayFullData?.goalScoredPerMatch, ';',
            awayFullData?.goalConcedePerMatch,
            '\n'
        );
        calculatedText.push('\n');


        // General Result
        const homeGeneralPergcentageOfVitory = this.getPercentageOfVictoryPlusPercentageOfLoosingAcrossTwo(homeFullData.generalLoosingPerncetage, awayFullData.generalWinningPerncetage);
        const awayGeneralPergcentageOfVitory = this.getPercentageOfVictoryPlusPercentageOfLoosingAcrossTwo(awayFullData.generalLoosingPerncetage,homeFullData.generalWinningPerncetage);
        const GeneralawayGeneralPergcentageOfVitoryMenusHomeGeneralPergcentageOfVitory = awayGeneralPergcentageOfVitory - homeGeneralPergcentageOfVitory;
        const homeGeneralQuikView = homeGeneralPergcentageOfVitory <= 25.0 ? 1: 0
        const awayGeneralQuikView = awayGeneralPergcentageOfVitory >= 50.0 ? 1: 0

        const homeMargen1 = 20.0 - homeGeneralPergcentageOfVitory;
        const awayMargen1 = awayGeneralPergcentageOfVitory - 50.0;
        // -------------------------------------------------
        calculatedText.push('General',';', 'PJ',';', 'G',';', 'E',';', 'P',';', 'generalWinningPerncetage', ';', 'generalDrawPerncetage', ';', 'generalLoosingPerncetage', ';','porcentaje  victorias VISITA + porcentaje DERROTAS local) / 2', ';','',';','Resta I4-I3 (57%-22%)', ';', 'generalQuikView WENN(I3<25%-"1"-WENN(I3>24%-"0"))', '\n');

        calculatedText.push(homeFullData.team,';', homeFullData.generalGamePlayed,';', homeFullData.generalWinning,';', homeFullData.generalDraw,';', homeFullData.generalLoosing,';', homeFullData.generalWinningPerncetage, ';', homeFullData.generalDrawPerncetage, ';', homeFullData.generalLoosingPerncetage, ';',homeGeneralPergcentageOfVitory.toFixed(2)+'%', ';','',';',GeneralawayGeneralPergcentageOfVitoryMenusHomeGeneralPergcentageOfVitory.toFixed(2)+'%', ';', homeGeneralQuikView, ';', homeMargen1.toFixed(2) + '%', '\n');
        calculatedText.push(awayFullData.team,';', awayFullData.generalGamePlayed,';', awayFullData.generalWinning,';', awayFullData.generalDraw,';', awayFullData.generalLoosing,';', awayFullData.generalWinningPerncetage, ';', awayFullData.generalDrawPerncetage, ';', awayFullData.generalLoosingPerncetage, ';',awayGeneralPergcentageOfVitory.toFixed(2)+'%', ';','',';','', ';', awayGeneralQuikView, ';', awayMargen1.toFixed(2) + '%', '\n');
        calculatedText.push('\n');


        // Home Away Result
        const homePercentageOfVictory = this.getPercentageOfVictoryPlusPercentageOfLoosingAcrossTwo(homeFullData.loosingPerncetage, awayFullData.winningPerncetage);
        const awayPercentageOfVictory = this.getPercentageOfVictoryPlusPercentageOfLoosingAcrossTwo(awayFullData.loosingPerncetage,homeFullData.winningPerncetage);
        const awayPercentageOfVictoryMinusHomePercentageOfVictory = awayPercentageOfVictory - homePercentageOfVictory;
        const homeQuikView = homePercentageOfVictory <= 20.0 ? 1: 0
        const awayQuikView = awayPercentageOfVictory >= 50.0 ? 1: 0

        const homeAwayHomeMargen1 = (20.0 - homePercentageOfVictory).toFixed(2) + '%';
        const homeAwayAwayMargen1 = (awayPercentageOfVictory - 50.0).toFixed(2) + '%';
        // -------------------------------------------------

        calculatedText.push('Home/Away',';', 'PJ',';', 'G',';', 'E',';', 'P',';', 'WinningPerncetage', ';', 'DrawPerncetage', ';', 'LoosingPerncetage', ';','porcentaje  victorias VISITA + porcentaje DERROTAS local) / 2', ';','',';','Resta I4-I3 (57%-22%)', ';', 'generalQuikView WENN(I3<25%-"1"-WENN(I3>24%-"0"))', '\n');
        calculatedText.push(homeFullData.team,';', homeFullData.gamePlayed,';', homeFullData.winning,';', homeFullData.draw,';', homeFullData.loosing,';', homeFullData.winningPerncetage, ';', homeFullData.drawPerncetage, ';', homeFullData.loosingPerncetage, ';',homePercentageOfVictory.toFixed(2)+'%', ';','',';',awayPercentageOfVictoryMinusHomePercentageOfVictory.toFixed(2)+'%', ';', homeQuikView, ';',homeAwayHomeMargen1, '\n');
        calculatedText.push(awayFullData.team,';', awayFullData.gamePlayed,';', awayFullData.winning,';', awayFullData.draw,';', awayFullData.loosing,';', awayFullData.winningPerncetage, ';', awayFullData.drawPerncetage, ';', awayFullData.loosingPerncetage, ';',awayPercentageOfVictory.toFixed(2)+'%', ';','',';','', ';', awayQuikView, ';',homeAwayAwayMargen1, '\n');
        calculatedText.push('\n');

        //Fisrt Goal
        let homeWinningAverage = 0;
        let awayWinningAverage = 0;
        let awayConcedeFirstAverage = 0;
        let homeConcedeFirstAverage = 0;

        try {
            if (homeFullData.firstGoalStats && awayFullData.firstGoalStats) {
                const totalHomeGoalFirst = parseInt(homeFullData.firstGoalStats.homeScoreFirst) + parseInt(homeFullData.firstGoalStats.homeNoGoal) + parseInt(homeFullData.firstGoalStats.homeConcededFirst);
                const totalAwayGoalFirst = parseInt(awayFullData.firstGoalStats.awayScoreFirst) + parseInt(awayFullData.firstGoalStats.awayNoGoal) + parseInt(awayFullData.firstGoalStats.awayConcededFirst);

                homeWinningAverage = ((parseInt(homeFullData.firstGoalStats.homeScoreFirst) / totalHomeGoalFirst) * 100).toFixed(2) ;
                awayWinningAverage = ((parseInt(awayFullData.firstGoalStats.awayScoreFirst) / totalAwayGoalFirst) * 100).toFixed(2);

                const homeNoGoalAverage = ((parseInt(homeFullData.firstGoalStats.homeNoGoal) / totalHomeGoalFirst) * 100).toFixed(2);
                const awayNoGoalAverage = ((parseInt(awayFullData.firstGoalStats.awayNoGoal) / totalAwayGoalFirst) * 100).toFixed(2);

                homeConcedeFirstAverage = ((parseInt(homeFullData.firstGoalStats.homeConcededFirst) / totalHomeGoalFirst) * 100).toFixed(2);
                awayConcedeFirstAverage = ((parseInt(awayFullData.firstGoalStats.awayConcededFirst) / totalAwayGoalFirst) * 100).toFixed(2);
                // -------------------------------------------------

                calculatedText.push('First Goal',';', 'local?',';', 'ScoreFirst',';', 'NoGoal',';', 'ConcededFirst',';', 'WinningAverage', ';', 'NoGoalAverage', ';','ConcedeFirstAverage', '\n');
                calculatedText.push(homeFullData.team,';', totalHomeGoalFirst,';', parseInt(homeFullData.firstGoalStats.homeScoreFirst),';', parseInt(homeFullData.firstGoalStats.homeNoGoal),';', parseInt(homeFullData.firstGoalStats.homeConcededFirst),';', homeWinningAverage, ';', homeNoGoalAverage, ';', homeConcedeFirstAverage, '\n');
                calculatedText.push(awayFullData.team,';', totalAwayGoalFirst,';', parseInt(awayFullData.firstGoalStats.awayScoreFirst),';', parseInt(awayFullData.firstGoalStats.awayNoGoal),';', parseInt(awayFullData.firstGoalStats.awayConcededFirst), ';',awayWinningAverage, ';', awayNoGoalAverage, ';', awayConcedeFirstAverage, '\n');
                calculatedText.push('\n');
            }
        } catch (e) {
            console.log('//Fisrt Goal');
        }

        // First Goal on the Match time

        try {
            if (homeFullData.openingGoalScored && awayFullData.openingGoalConceded) {
                const totalHomeGoalFirstTime = parseInt(homeFullData.openingGoalScored.firstQuarter) + parseInt(homeFullData.openingGoalScored.secondQuarter) + parseInt(homeFullData.openingGoalScored.thirdQuarter);
                const totalAwayGoalFirstTime = parseInt(awayFullData.openingGoalConceded.firstQuarter) + parseInt(awayFullData.openingGoalConceded.secondQuarter) + parseInt(awayFullData.openingGoalConceded.thirdQuarter)

                const totalHomeGoalSecontTime = parseInt(homeFullData.openingGoalScored.fourthQuarter) + parseInt(homeFullData.openingGoalScored.fivethQuarter) + parseInt(homeFullData.openingGoalScored.sixthQuarter);
                const totalAwayGoalSecontTime = parseInt(awayFullData.openingGoalConceded.fourthQuarter) + parseInt(awayFullData.openingGoalConceded.fivethQuarter) + parseInt(awayFullData.openingGoalConceded.sixthQuarter)

                const totalHomeGoalMatch = totalHomeGoalFirstTime + totalHomeGoalSecontTime;
                const totalAwayGoalMatch = totalAwayGoalFirstTime + totalAwayGoalSecontTime;

                const averageScorePlusConceded = (parseFloat(homeFullData.openingGoalScored.firstHalf) + parseFloat(awayFullData.openingGoalConceded.firstHalf))/2;

                calculatedText.push('First Goal on the Mache',';','total',';', '1er',';', '2do',';', '%1er',';', '%2do', '\n');
                calculatedText.push(homeFullData.team,';', totalHomeGoalMatch,';', totalHomeGoalFirstTime,';', totalHomeGoalSecontTime,';', homeFullData.openingGoalScored.firstHalf,';', homeFullData.openingGoalScored.secondHalf, '\n');
                calculatedText.push(awayFullData.team,';', totalAwayGoalMatch,';', totalAwayGoalFirstTime,';', totalAwayGoalSecontTime,';', awayFullData.openingGoalConceded.firstHalf, ';',awayFullData.openingGoalConceded.secondHalf, '\n');
                calculatedText.push('',';', '',';', '',';', '',';', averageScorePlusConceded + '%','\n');
                calculatedText.push('\n');
            }
        } catch (e) {
            console.log('// First Goal on the Match time')
        }



        // Matrix of 1s

        const firstDecitionHomeWinnerbiggerThan40 = parseFloat(homeFullData.generalWinningPerncetage) >= 40 ? 1 : 0;
        const secondDecitionHomeLossingLessThan30 = parseFloat(homeFullData.generalLoosingPerncetage) <= 30 ? 1 : 0;
        const thirthDecitionAwayWinningLessThan30 = parseFloat(awayFullData.generalWinningPerncetage) <= 30 ? 1 : 0;
        const fouthDecitionAwayWinnerbiggerThan45 = parseFloat(awayFullData.generalLoosingPerncetage) >= 45 ? 1 : 0;


        calculatedText.push('',';', firstDecitionHomeWinnerbiggerThan40,';',secondDecitionHomeLossingLessThan30, '\n');
        calculatedText.push('',';', thirthDecitionAwayWinningLessThan30,';',fouthDecitionAwayWinnerbiggerThan45, '\n');
        calculatedText.push('\n');

        // second part

        // F10+P11/2

        let probabilityOfFirstGoalLocalTeam = 0;
        if (homeWinningAverage || awayConcedeFirstAverage){
            //Q11
            probabilityOfFirstGoalLocalTeam = ((parseFloat(homeWinningAverage) + parseFloat(awayConcedeFirstAverage))/2).toFixed(2);
        }

        // H10 +N 11 /2

        let probabilityOfFirstGoalAwayTeam = 0;
        if (homeConcedeFirstAverage || homeWinningAverage) {
            //Q10
            probabilityOfFirstGoalAwayTeam = ((parseFloat(homeConcedeFirstAverage) + parseFloat(awayWinningAverage))/2).toFixed(2);
        }


        // R10
        const probabilityOfFirstGaolBetweenLocalTeamAndAwayTeam = (probabilityOfFirstGoalLocalTeam - probabilityOfFirstGoalAwayTeam) /100;

        const homeWinningPercentage = homeFullData.winningPerncetage;
        const awayWinningPercentage = awayFullData.winningPerncetage;
        const resultHomeWinningPercentageMinusAwayWinningPercentage = parseFloat(homeWinningPercentage) - parseFloat(awayWinningPercentage);

        const resultHomeFailToScoreMinusAwayFailToScore = (parseFloat(homeFullData.failedToScoreInPercentage) + parseFloat(awayFullData.cleanSheetInPercentage)) / 2;

        const resultAwayFailedToScoreInPercentagePlusHomeCleanSheetInPercentageDivideTwo = (parseFloat(awayFullData.failedToScoreInPercentage) +  parseFloat(homeFullData.cleanSheetInPercentage)) /2;

        // y13
        const avgGoalScoreLocalPlusGoalConcededAwayDivideTwo =  (parseFloat(awayFullData.goalScoredPerMatch) + parseFloat(homeFullData.goalConcedePerMatch)) /2 ;

        // y14
        const avgGoalScoreAwayPlusGoalConcededLocalDivideTwo =  (parseFloat(homeFullData.goalScoredPerMatch) + parseFloat(awayFullData.goalConcedePerMatch)) /2;
        const avgGoalScoredAndConceded = avgGoalScoreAwayPlusGoalConcededLocalDivideTwo - avgGoalScoreLocalPlusGoalConcededAwayDivideTwo;


        //1st parameter
        GeneralawayGeneralPergcentageOfVitoryMenusHomeGeneralPergcentageOfVitory;
        // 2nd Parameter
        awayPercentageOfVictoryMinusHomePercentageOfVictory;

        // 3th Parameter
        probabilityOfFirstGaolBetweenLocalTeamAndAwayTeam;

        //4th parameter
        resultHomeWinningPercentageMinusAwayWinningPercentage;

        //5th parameter
        const probabilityOfLocalTeamScoreAGoal = 100 - resultHomeFailToScoreMinusAwayFailToScore;

        //6th parameter
        resultAwayFailedToScoreInPercentagePlusHomeCleanSheetInPercentageDivideTwo;

        // 7th param
        avgGoalScoredAndConceded

        //WENN(O6<10%;"0";WENN(O6>9%;"1"))
        const decisionParamOne = GeneralawayGeneralPergcentageOfVitoryMenusHomeGeneralPergcentageOfVitory > 10.0 ? 1 : 0;

        //WENN(P6<46%;"0";WENN(P6>45%;"1"))
        const decisionParamTwo = awayPercentageOfVictoryMinusHomePercentageOfVictory > 45.5 ? 1 : 0;

        //WENN(Q6<35%;"0";WENN(Q6>34%;"1"))
        const decisionParamThree = (probabilityOfFirstGaolBetweenLocalTeamAndAwayTeam * 100) > 34.0 ? 1 : 0;

        //WENN(R6<33%;"0";WENN(R6>32%;"1"))
        const decisionParamFour = resultHomeWinningPercentageMinusAwayWinningPercentage > 32.0 ? 1 : 0;

        //WENN(S6<77%;"0";WENN(S6>76%;"1"))
        const decisionParamFive = probabilityOfLocalTeamScoreAGoal > 76.0 ? 1 : 0;

        //WENN(T6<40%;"0";WENN(T6>39%;"1"))
        const decisionParamSix = resultAwayFailedToScoreInPercentagePlusHomeCleanSheetInPercentageDivideTwo > 39.0 ? 1 : 0;

        //WENN(U6<0,75;"0";WENN(U6>0,74;"1"))
        const decisionParamSeven = avgGoalScoredAndConceded > 0.74 ? 1 : 0;

        const finalResult = decisionParamOne + decisionParamTwo + decisionParamThree + decisionParamFour + decisionParamFive + decisionParamSix + decisionParamSeven;
        const finalInPercentage = ((finalResult /7)*100).toFixed(2)  + '%';

        calculatedText.push('final Decision',';','1', ';','2', ';','3', ';','4', ';','5', ';','6', ';','7', '\n');
        calculatedText.push(
            '',';',
            GeneralawayGeneralPergcentageOfVitoryMenusHomeGeneralPergcentageOfVitory.toFixed(2) + '%', ';',
            awayPercentageOfVictoryMinusHomePercentageOfVictory.toFixed(2) + '%', ';',
            (probabilityOfFirstGaolBetweenLocalTeamAndAwayTeam * 100).toFixed(2) + '%', ';',
            resultHomeWinningPercentageMinusAwayWinningPercentage.toFixed(2) + '%', ';',
            probabilityOfLocalTeamScoreAGoal.toFixed(2) + '%', ';',
            resultAwayFailedToScoreInPercentagePlusHomeCleanSheetInPercentageDivideTwo.toFixed(2) + '%', ';',
            avgGoalScoredAndConceded.toFixed(2), '\n');

        calculatedText.push(
            '',';',
            decisionParamOne, ';',
            decisionParamTwo, ';',
            decisionParamThree, ';',
            decisionParamFour, ';',
            decisionParamFive, ';',
            decisionParamSix, ';',
            decisionParamSeven, ';',
            finalResult,';',
            finalInPercentage, '\n'
        );

        calculatedText.push('\n');

        calculatedText.push(
            '****************',';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************',';',
            '****************', '\n'
        );

        calculatedText.push(
            '****************',';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************', ';',
            '****************',';',
            '****************', '\n'
        );


        return calculatedText.join(' ');

    },
    getPercentageOfVictoryPlusPercentageOfLoosingAcrossTwo(data1, data2) {
        const a = data2.replace('%', '');
        const b = data1.replace('%', '');
        const sum = parseFloat(a)+parseFloat(b)
       return (sum/2);
    }
}
