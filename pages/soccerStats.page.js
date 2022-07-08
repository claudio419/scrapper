require('dotenv-defaults');
const CountryLeague = require('../soccerStats/countryLeague');
const FirstGoalStats = require('../soccerStats/firstGoalStats');
const FirstGoalStatsTeam = require('../soccerStats/firstGoalStatsTeam');
const League = require('../soccerStats/leagues');
const Match = require('../soccerStats/match.js');
const OpeningScore = require('../soccerStats/openingScore');
const Position = require('../soccerStats/position.js');
const Team = require('../soccerStats/team.js');
const { I } = inject();

module.exports = {
    locators: {
        matchsTrsVisible: '#content > div:nth-child(6) > div > table:nth-child(14) > tbody > tr > td > table:not(.detail) > tbody .parent, #content > div:nth-child(6) > div > table:nth-child(14) > tbody > tr > td > table:not(.detail) > tbody .child, #content > div:nth-child(6) > div > table:nth-child(14) > tbody > tr > td > table:not(.detail) > tbody [bgcolor="#f0f0f0"]',
        matchsTrsHidden: '#content > div:nth-child(6) > div > table:nth-child(14) > tbody > tr > td > table.detail > tbody > tr',
        homeAwayLink:'[href^="homeaway.asp?league="].countrylist',
        home: '#h2h-team1 #btable > tbody > tr.odd',
        away:'#h2h-team2 #btable > tbody > tr.odd',
        firstGoalStatsButton: '[href^="firstgoal.asp?league="].SmallButton',
        firstGoalStatsTables: '#btable > tbody', // it hat many tables, I should iterate it
    },

    goToDailyMachtPageWithTermAndConditions(matchDayParam) {
       this.goToDailyMachtPage(matchDayParam);
        I.click('AGREE', '.qc-cmp2-summary-buttons')

    },

    goToDailyMachtPage(matchDayParam) {

        I.amOnPage(`${process.env.SOCCERSTATS_URL}matches.asp?matchday=${matchDayParam}`);
    },

    goToPageByPath(path) {
        I.amOnPage(`${process.env.SOCCERSTATS_URL}` + path);
    },

    async getPlayingLeagues(selector) {

        const playingLeagues = [];

        const tableMatchs = await I.grabHTMLFromAll(selector);

        let currentLeague = '';
        let home = '';
        let away = '';

        for(let x = 0; x < tableMatchs.length; x++) {

            const element = this.tdsHandler(tableMatchs[x]);
            if (!element) {
                continue;
            }

            if(element.dataType === 'League' &&  !currentLeague) {
                currentLeague = new League(element.countryLeagueName, element.statsUrl);
                continue
            }

            if(element.dataType === 'League' && this.isNewLeague(currentLeague.league, element.countryLeagueName)) {
                playingLeagues.push(currentLeague)
                currentLeague = new League(element.countryLeagueName, element.statsUrl);
                continue
            }

            if (element.dataType === 'Home') {
                home = element;
                continue;
            }

            if (element.dataType === 'Away') {
                away = element;
            }

           const match = new Match(home.matchTime, home, away);

            currentLeague.setMatches(match);
        }

        return playingLeagues;

    },

    async fillHomeAwayDataByPlayingLeagues(playingLeagues) {


        for(let l = 0; l < playingLeagues.length; l++) {

            try {
                if(playingLeagues[l].getMatches().length === 0) {
                    continue;
                }

                this.goToPageByPath(playingLeagues[l].statsUrl);
                const homeAwayUrl = await I.grabAttributeFrom(this.locators.homeAwayLink, 'href');
                I.amOnPage(homeAwayUrl);

                const homeTable = await this.getPositionsTable(this.locators.home);
                const awayTable = await this.getPositionsTable(this.locators.away);

                playingLeagues[l].setHomeTable(homeTable);
                playingLeagues[l].setAwayTable(awayTable);

            } catch (e) {
                console.log(e);
                console.log(playingLeagues[l].league);
            }
       }

       return playingLeagues;

    },

    async fillFirstGoalStats(playingLeagues) {

        let firstGoalStats;

        for(let l = 0; l < playingLeagues.length; l++) {

            try {
                if(playingLeagues[l].getMatches().length === 0) {
                    continue;
                }

                this.goToPageByPath(playingLeagues[l].statsUrl);


                const numberOfButton = await I.grabNumberOfVisibleElements(this.locators.firstGoalStatsButton);
                if (numberOfButton < 1) {
                    continue;
                }

                const firstGoalStatsUrl = await I.grabAttributeFrom(this.locators.firstGoalStatsButton, 'href');

                I.amOnPage(firstGoalStatsUrl);

                const allTable = await I.grabHTMLFromAll(this.locators.firstGoalStatsTables);// I get many Table
                const firstGoalStatsTable = this.getFirstGoalStatsTable(allTable[0]);
                const homeOpeningGoalScoredTable = this.getOpeningGoalsScoredTable(allTable[2]);
                const awayOpeningGoalScoredTable = this.getOpeningGoalsScoredTable(allTable[3]);
                const homeConcededGoalTable = this.getOpeningGoalsScoredTable(allTable[5]);
                const awayConcededGoalTable = this.getOpeningGoalsScoredTable(allTable[6]);

                firstGoalStats = new FirstGoalStats(firstGoalStatsTable, homeOpeningGoalScoredTable, awayOpeningGoalScoredTable, homeConcededGoalTable, awayConcededGoalTable)
                playingLeagues[l].setFirstGoalStats(firstGoalStats);
            } catch (e) {
                console.log(playingLeagues[l].league);
                console.log(e);
                console.log(allTable);
            }
        }

        return playingLeagues;
    },


    tdsHandler(tds) {
        const totalTds = this.tdsCounter(tds);

        switch (totalTds) {
            case 2: // Number of tds to see league
                 return this.processTitle(tds);
            case 17:// number of tds to home match
                return this.processHome(tds);
            case 15: // number of tds to away match
                return this.processAway(tds);
        }

    },

    tdsCounter(tds) {
        let arr = tds.split('</td>');
        arr = arr.filter(element => {
            return element !== '';
        });
        return arr.length;
    },

    processTitle(tds){
        try {
            const hasImg = tds.search('<img src=');
            const isPlayOff = tds.search('play-off');

            if (hasImg < 0) {
                return null;
            }

            if (isPlayOff >= 0) {
                return null
            }

            let arr = tds.split('<font size="2">');
            const arr1 = arr[1].split('</font>');
            const countryLeagueName = arr1[0];
            const arr2 = arr1[1].split('href="');

            arr = arr2[1]?.split('">');


            const statsUrl = arr[0];

            let matchesPlayed = '';
            const hasMatchesPlayed = tds.search('Matches played: <b>');

            if (hasMatchesPlayed >= 0) {
                matchesPlayed = arr[3].replace('Matches played: <b>', '').replace('</b>', '');
            }

            return new CountryLeague(countryLeagueName, statsUrl, matchesPlayed, 'League');

        } catch (e) {
            console.log('Error!!!!!!!!!!!!!!!!!!!!!!');
            console.log(e);
            console.log(tds);
            return '';
        }

    },

    processHome(tds){
        const isHome = tds.search('home');

        if (isHome < 0) {
            return null;
        }

        let arr = tds.split('</td>');
        arr = arr.filter(element => {
            return element !== '';
        });

        const teamName = arr[0].replace('<td class="steam">','');
        const matchTime = arr[1].replace('<td rowspan="2" align="center" valign="middle"><font size="1" color="gray">','').replace('</font>', '');
        const scope = arr[2].replace('<td class="sgray">', '');
        const gamePlayed = arr[3].replace('<td class="sgray">', '');
        const winningPercentageOfMatches = arr[4].replace('<td class="sgreen">', '');
        const failedToScoreInPercentage = arr[5].replace('<td class="sblack">', '');
        const cleanSheetInPercentage = arr[6].replace('<td class="sblack">', '');
        const matchesWhereBothTeamsScoredInPercentage = arr[7].replace('<td class="sblack">', '');
        const totalGoalsScoreAndConcededPerMatch = arr[8].replace('<td class="sblack">', '');
        const goalScoredPerMatch = arr[9].replace('<td class="sgreen">', '');
        const goalsConcededPerMatch = arr[10].replace('<td class="sred">', '');
        const oneAndHalbGoal = arr[11].replace('<td class="sblack">', '');
        const twoAndHalbGoal = arr[12].replace('<td class="sred">', '').replace('<td class="sblue">', '');
        const threeAndHalbGoal = arr[13].replace('<td class="sblack">', '');
        const pointsPerGame = arr[15].replace('<td><font color="gray"><b>', '').replace('</b></font>', '');

        return new Team(
            teamName,
            matchTime,
            scope,
            gamePlayed,
            winningPercentageOfMatches,
            failedToScoreInPercentage,
            cleanSheetInPercentage,
            matchesWhereBothTeamsScoredInPercentage,
            totalGoalsScoreAndConcededPerMatch,
            goalScoredPerMatch,
            goalsConcededPerMatch,
            oneAndHalbGoal,
            twoAndHalbGoal,
            threeAndHalbGoal,
            pointsPerGame,
            'Home'
        );

    },
    processAway(tds){
        const isAway = tds.search('away');

        if (isAway < 0) {
            return null;
        }

        let arr = tds.split('</td>');
        arr = arr.filter(element => {
            return element !== '';
        });

        const teamName = arr[0].replace('<td class="steam">','');
        const scope = arr[1].replace('<td class="sgray">', '');
        const gamePlayed = arr[2].replace('<td class="sgray">', '');
        const winningPercentageOfMatches = arr[3].replace('<td class="sgreen">', '');
        const failedToScoreInPercentage = arr[4].replace('<td class="sblack">', '');
        const cleanSheetInPercentage = arr[5].replace('<td class="sblack">', '');
        const matchesWhereBothTeamsScoredInPercentage = arr[6].replace('<td class="sblack">', '');
        const totalGoalsScoreAndConcededPerMatch = arr[7].replace('<td class="sblack">', '');
        const goalScoredPerMatch = arr[8].replace('<td class="sgreen">', '');
        const goalsConcededPerMatch = arr[9].replace('<td class="sred">', '');
        const oneAndHalbGoal = arr[10].replace('<td class="sblack">', '');
        const twoAndHalbGoal = arr[11].replace('<td class="sred">', '').replace('<td class="sblue">', '');
        const threeAndHalbGoal = arr[12].replace('<td class="sblack">', '');
        const pointsPerGame = arr[14].replace('<td><font color="gray"><b>', '').replace('</b></font>', '');

        return new Team(
            teamName,
            '',
            scope,
            gamePlayed,
            winningPercentageOfMatches,
            failedToScoreInPercentage,
            cleanSheetInPercentage,
            matchesWhereBothTeamsScoredInPercentage,
            totalGoalsScoreAndConcededPerMatch,
            goalScoredPerMatch,
            goalsConcededPerMatch,
            oneAndHalbGoal,
            twoAndHalbGoal,
            threeAndHalbGoal,
            pointsPerGame,
            'Away'
        );
    },

    isNewLeague(currentLeagueName, LeagueName) {
        return currentLeagueName !== LeagueName;
    },

    async getPositionsTable(tableSelector) {

        let position;
        const table = [];
        const trsTable = await I.grabHTMLFromAll(tableSelector);
        for(let x = 0; x < trsTable.length; x++) {
            let arr = trsTable[x].split('</td>');
            const teamName = arr[1].replaceAll('\n<td style="padding-left:4px;">\n', '').replaceAll('\n','');
            const gamePlayed = arr[2].replaceAll('\n<td align="center">\n<font color="green">\n', '').replaceAll('\n</font>\n', '');
            const winning = arr[3].replaceAll('\n<td align="center">\n', '').replaceAll('\n', '').replaceAll(' ', '');
            const draw = arr[4].replaceAll('\n<td align="center">\n', '').replaceAll('\n', '').replaceAll(' ', '');
            const loosing = arr[5].replaceAll('\n<td align="center">\n', '').replaceAll('\n', '').replaceAll(' ', '');
            position = new Position(teamName, gamePlayed, winning, draw, loosing);
            table.push(position);
        }

        return table;
    },

    fillFirstGoalStatsTeam(tds) {


        const team = tds[0]
            .replaceAll('\n', '')
            .replace('</a>', '')
            .split('>')[3]; // return team name

        const gamePlayed = tds[1]
            ?.replaceAll('\n', '')
            ?.replaceAll(' ', '')
            ?.replace('</font>', '')
            ?.split('>')[2] // Return game played;

        const homeScoreFirst = tds[3]
            ?.replaceAll('\n', '')
            ?.replaceAll(' ', '')
            ?.replace('</font>', '')
            ?.split('>')[2] // Return homeScoreFirst;

        const homeNoGoal = tds[4]
            ?.replaceAll('\n', '')
            ?.replaceAll(' ', '')
            ?.split('>')[1] // Return homeNoGoal;

        const homeConcededFirst = tds[5]
            ?.replaceAll('\n', '')
            ?.replaceAll(' ', '')
            ?.replace('</font>', '')
            ?.split('>')[2] // Return homeConcededFirst;

        const awayScoreFirst = tds[6]
            ?.replaceAll('\n', '')
            ?.replaceAll(' ', '')
            ?.replace('</font>', '')
            ?.split('>')[2] // Return awayScoreFirst

        const awayNoGoal = tds[7]
            ?.replaceAll('\n', '')
            ?.replaceAll(' ', '')
            ?.split('>')[1] // Return  awayNoGoal;

        const awayConcededFirst = tds[8]
            ?.replaceAll('\n', '')
            ?.replaceAll(' ', '')
            ?.replace('</font>', '')
            ?.split('>')[2] // Return homeConcededFirst;

        if (!team && !gamePlayed && !homeScoreFirst && !homeNoGoal && !homeConcededFirst && !awayScoreFirst && !awayNoGoal && !awayConcededFirst) {
            return null;
        }

        return new FirstGoalStatsTeam(team, gamePlayed, homeScoreFirst, homeNoGoal, homeConcededFirst, awayScoreFirst, awayNoGoal, awayConcededFirst);

    },

    getFirstGoalStatsTable(htmlTable) {
        const firstGoalStatsTable = [];
        let firstGoalStatsTeam;
        const firstGoalStatsTableHtml = htmlTable; // frist table ist firstGoalStats table
        const firstGoalStatArray = firstGoalStatsTableHtml.split('</tr>') // convert it as array

        for (let x = 0; x < firstGoalStatArray.length; x++) {
            if (firstGoalStatArray[x].search('bgcolor="#e0e0e0"') >= 0 ) {
                continue;
            }

            firstGoalStatArray[x].replace('<tr class="odd" height="26">', '');
            const tds = firstGoalStatArray[x].split('</td>');

            if (tds.length > 0 ) {
                firstGoalStatsTeam = this.fillFirstGoalStatsTeam(tds);
            }

            if (firstGoalStatsTeam) {
                firstGoalStatsTable.push(firstGoalStatsTeam);
            }


        }

        return firstGoalStatsTable;

    },

    getOpeningGoalsScoredTable(htmlTable) {
        const openingGoalsScoredTableHtml = htmlTable; // table ist home opening goal score table
        const openingScoreArray = openingGoalsScoredTableHtml.split('</tr>') // convert it as array
        const openingScoredTable = [];
        let openingScores;

        for (let x = 0; x < openingScoreArray.length; x++) {
            if (openingScoreArray[x].search('class="trow2">') >= 0 ) {
                continue;
            }

            openingScoreArray[x].replace('<tr class="odd" height="26">', '');
            const tds = openingScoreArray[x].split('</td>');

            openingScores = this.fillOpeningScores(tds)

            if (openingScores) {
                openingScoredTable.push(openingScores)
            }

        }

        return openingScoredTable;
    },

    fillOpeningScores(tds) {

        if (tds[0].search('League avg.') >= 0) {
            return null;
        }

        const team = tds[0]
            .replaceAll('\n', '')
            .replaceAll('&nbsp;', '')
            .replace('<tr class="odd" height="26">', '')
            .replace('<td align="right">', '')
            .replace('</a>', '')
            .split('>')[1];

        const openScore = tds[1]
            ?.replaceAll('\n', '')
            ?.replace('<td align="center"><font color="blue">', '')
            ?.replace('<td align="center"><font color="#C70039">', '')
            ?.replace('</font>', '');

        const averageMinute = tds[2]
            ?.replaceAll('\n', '')
            ?.replace('<td align="center"><font color="blue">', '')
            ?.replace('<td align="center"><font color="#C70039">', '')
            ?.replace('<b>', '')
            ?.replace('</b>', '')
            ?.replace('</font>', '');

        const firstQuarter = tds[3]
            ?.replaceAll('\n', '')
            ?.replace('<td align="center">', '');
        const secondQuarter = tds[4]
            ?.replaceAll('\n', '')
            ?.replace('<td align="center">', '');
        const thirdQuarter = tds[5]
            ?.replaceAll('\n', '')
            ?.replace('<td align="center">', '');
        const fourthQuarter = tds[6]
            ?.replaceAll('\n', '')
            ?.replace('<td align="center">', '');
        const fivethQuarter = tds[7]
            ?.replaceAll('\n', '')
            ?.replace('<td align="center">', '');
        const sixthQuarter = tds[8]
            ?.replaceAll('\n', '')
            ?.replace('<td align="center">', '');
        const firstHalf = tds[10]
            ?.replaceAll('\n', '')
            ?.replace('<td width="30" align="center"><font color="blue">', '')
            ?.replace('<td width="30" align="center"><font color="#C70039">', '')
            ?.replace('</font>', '');
        const secondHalf = tds[13]
            ?.replaceAll('\n', '')
            ?.replace('<td width="30" align="center"><font color="blue">', '')
            ?.replace('<td width="30" align="center"><font color="#C70039">', '')
            ?.replace('</font>', '');


        if (!team && !openScore && !averageMinute && !firstQuarter && !secondQuarter && !thirdQuarter && !fourthQuarter && !fivethQuarter && !sixthQuarter && !firstHalf && !secondHalf) {
            return null;
        }

        if (team === '<td colspan="14"') {
            return null;
        }

        return new OpeningScore(team, openScore, averageMinute, firstQuarter, secondQuarter, thirdQuarter, fourthQuarter, fivethQuarter, sixthQuarter, firstHalf, secondHalf);
    }
}
