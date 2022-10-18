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
       I.waitForVisible('.qc-cmp2-summary-buttons', 500);
        I.click('AGREE', '.qc-cmp2-summary-buttons')

    },

    goToDailyMachtPage(matchDayParam) {

        I.amOnPage(`${process.env.SOCCERSTATS_URL}matches.asp?matchday=${matchDayParam}`);
    },

    async goToPageByPath(path) {
        console.log('url to go: ', `${process.env.SOCCERSTATS_URL}` + path)
        I.amOnPage(`${process.env.SOCCERSTATS_URL}${path}`);
        const hasButton = await I.grabNumberOfVisibleElements('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-47sehv');
        if (hasButton > 0) {
            I.click('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-47sehv')
        }
        },

    async getPlayedGames(selector) {
        const playedGames = [];
        let playedMatches = [];

        const tableMatchs = await I.grabHTMLFromAll(selector);

        let currentLeague = '';
        let home = '';
        let away = '';

        for(let x = 0; x < tableMatchs.length; x++) {
        //for(let x = 0; x < 15; x++) {

            const element = this.gamesPlayedtdsHandler(tableMatchs[x]);
            if (!element) {
                continue;
            }

            if(element.dataType === 'League' &&  !currentLeague) {
                currentLeague = element;
                continue
            }

            if(element.dataType === 'League' && this.isNewLeague(currentLeague.league, element.leaague)) {
                currentLeague.match = playedMatches;
                playedGames.push(currentLeague)


                currentLeague = element;
                playedMatches = []
                continue
            }

            if (element.dataType === 'Home') {
                home = element;
                continue;
            }

            if (element.dataType === 'Away') {
                away = element;
            }

            playedMatches.push({'home': home, 'away': away})
        }

        return playedGames;
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

                if(this.isLeagueInBlackList(playingLeagues[l].league)) {
                    console.log ('league', playingLeagues[l].league, 'skipped');
                    continue;
                }
                I.say('league is not in black list');

                if(playingLeagues[l].matches.length === 0) {
                    continue;
                }

                I.say('league hat matches');

                if (!playingLeagues[l].statsUrl) {
                    console.log('Error league')
                    console.log(playingLeagues[l]);
                    continue;
                }

                I.say('go to url: ' + playingLeagues[l].statsUrl);
                await this.goToPageByPath(playingLeagues[l].statsUrl);

                const homeAwayUrl = await I.grabAttributeFrom(this.locators.homeAwayLink, 'href');
                I.say('homeAwayurl' + homeAwayUrl );
                I.amOnPage(homeAwayUrl);

                const homeTable = await this.getPositionsTable(this.locators.home);
                const awayTable = await this.getPositionsTable(this.locators.away);

                playingLeagues[l].homeTable = homeTable;
                playingLeagues[l].awayTable = awayTable;

            } catch (e) {
                console.log('Exception: ',e);
                console.log(playingLeagues[l]);
            }
       }

       return playingLeagues;

    },

    async fillFirstGoalStats(playingLeagues) {

        let firstGoalStats;

        for(let l = 0; l < playingLeagues.length; l++) {

            try {

                if(this.isLeagueInBlackList(playingLeagues[l].league)) {
                    console.log ('league', playingLeagues[l].league, 'skipped');
                    continue;
                }

                if(playingLeagues[l].matches?.length === 0) {
                    continue;
                }

                if (!playingLeagues[l].statsUrl) {
                    console.log('Error league')
                    console.log(playingLeagues[l]);
                    continue;
                }

                this.goToPageByPath(playingLeagues[l].statsUrl);


                const numberOfButton = await I.grabNumberOfVisibleElements(this.locators.firstGoalStatsButton);
                if (numberOfButton < 1) {
                    continue;
                }

                const firstGoalStatsUrl = await I.grabAttributeFrom(this.locators.firstGoalStatsButton, 'href');
                console.log('firstGoalStatsUrl: ', firstGoalStatsUrl);

                I.amOnPage(firstGoalStatsUrl);

                const allTable = await I.grabHTMLFromAll(this.locators.firstGoalStatsTables);// I get many Table
                const firstGoalStatsTable = this.getFirstGoalStatsTable(allTable[0]);
                const homeOpeningGoalScoredTable = this.getOpeningGoalsScoredTable(allTable[2]);
                const awayOpeningGoalScoredTable = this.getOpeningGoalsScoredTable(allTable[3]);
                const homeConcededGoalTable = this.getOpeningGoalsScoredTable(allTable[5]);
                const awayConcededGoalTable = this.getOpeningGoalsScoredTable(allTable[6]);

                firstGoalStats = new FirstGoalStats(firstGoalStatsTable, homeOpeningGoalScoredTable, awayOpeningGoalScoredTable, homeConcededGoalTable, awayConcededGoalTable)
                playingLeagues[l].firstGoalStats = firstGoalStats;
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

    gamesPlayedtdsHandler(tds) {
        const totalTds = this.tdsCounter(tds);

        switch (totalTds) {
            case 2: // Number of tds to see league
                return this.getPlayedLeagueName(tds);
            case 5:// number of tds to home match
                return this.getPlayedHomeTeamName(tds);
            case 4: // number of tds to away match
                return this.getPlayedAwayTeamName(tds);
        }

        return '';
    },

    tdsCounter(tds) {
        let arr = tds.split('</td>');
        arr = arr.filter(element => {
            return element !== '';
        });
        return arr.length;
    },

    getPlayedLeagueName(tds){
        try {

            const hasImg = tds.search('<img src=');
            const isPlayOff = tds.search('play-off');

            if (hasImg < 0) {
                return null;
            }

            if (isPlayOff >= 0) {
                return null
            }

            const html = tds.split('<font size="2">');
            const leaague = html[1].split('</font>');

           return {
               'dataType': 'League',
               'leaague': leaague[0]
           }


        } catch (e) {
            console.log('Error!!!!!!!!!!!!!!!!!!!!!!');
            console.log(e);
            console.log(tds);
            return '';
        }
    },
    getPlayedHomeTeamName(tds){
        let playedTeam = this.getPlayedHomeAwayTeamName(tds);
        playedTeam.dataType = 'Home';

        return playedTeam
    },
    getPlayedAwayTeamName(tds){
        let playedTeam = this.getPlayedHomeAwayTeamName(tds);
        playedTeam.dataType = 'Away';

        return playedTeam
    },
    getPlayedHomeAwayTeamName(tds){
        try {
            const html = tds.split('</td>');
            const teamName = html[0].replaceAll('<td class="steam">', '').replaceAll('<td class="steam" width="110">', '');
            const result = html[1].replaceAll('<td align="center" valign="middle"><b>', '')
                .replaceAll('</b>', '')
                .replaceAll('<td width="55" valign="middle" align="center"><b>', '')
                .replaceAll('<td align="center" valign="middle" width="55"><b>>', '')
                .replaceAll('<td align=\"center\" valign=\"middle\" width=\"55\"><b>', '');

            return {
                'teamName': teamName,
                'result': result
            }

        } catch (e) {
            console.log('Error!!!!!!!!!!!!!!!!!!!!!!');
            console.log(e);
            console.log(tds);
            return '';
        }
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
            const gamePlayed = arr[2].replaceAll('\n<td align="center">\n<font color="green">\n', '').replaceAll('\n</font>\n', '').replaceAll('\n<td align=\"center\">\n<font color=\"green\"> \n', '');
            const winning = arr[3].replaceAll('\n<td align="center">\n', '').replaceAll('\n', '').replaceAll(' ', '');
            const draw = arr[4].replaceAll('<tdalign="center">', '').replaceAll('\n<td align="center">\n', '').replaceAll('\n', '').replaceAll(' ', '');
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
            ?.replace('<td width="30" align="right"><font style="color:blue;font-size:11px;">', '')
            ?.replace('<td width="30\" align="right"><font style="color:#C70039;font-size:11px;">', '')
            ?.replace('</font>', '');
        const secondHalf = tds[13]
            ?.replaceAll('\n', '')
            ?.replace('<td width="30" align="center"><font color="blue">', '')
            ?.replace('<td width="30" align="center"><font color="#C70039">', '')
            ?.replace('<td width="30" align="left"><font color="blue" ;font-size:11px;="">', '')
            ?.replace('<td width="30" align="left"><font color="#C70039" ;font-size:11px;="">', '')
            ?.replace('</font>', '');


        if (!team && !openScore && !averageMinute && !firstQuarter && !secondQuarter && !thirdQuarter && !fourthQuarter && !fivethQuarter && !sixthQuarter && !firstHalf && !secondHalf) {
            return null;
        }

        if (team === '<td colspan="14"') {
            return null;
        }

        return new OpeningScore(team, openScore, averageMinute, firstQuarter, secondQuarter, thirdQuarter, fourthQuarter, fivethQuarter, sixthQuarter, firstHalf, secondHalf);
    },
    isLeagueInBlackList(league) {
        const leagueBlackList = [
            'Argentina - Primera C - Clausura',
            'Australia - Northern Territory PL',
            'Australia - NPL Capital Territory',
            'Australia - NPL Queensland',
            'Australia - NPL Tasmania',
            'Australia - NPL Victoria',
            'Australia - NPL Western Australia',
            'Austria - Regionalliga Mitte',
            'Austria - Regionalliga Ost',
            'Austria - Regionalliga Tirol',
            'Austria - Regionalliga Voralberg',
            'Belarus - First League',
            'Belarus - Women Premier League',
            'Belgium - National Division 1',
            'Bosnia and Herzegovina - FBiH',
            'Costa Rica - Liga de Ascenso - Apertura',
            'CzechRepublic - U19 League',
            'Denmark - Elitedivisionen Women',
            'England - Isthmian Div. 1 North',
            'England - Isthmian Div. 1 South C.',
            'England - National L. North',
            'England - National L. South',
            'England - National League',
            'England - PL 2 Div. 1',
            'England - Women Super League',
            'FaroeIslands - 1. Deild',
            'France - Division 1 Women',
            'France - National 2 - Gr. A',
            'France - National 2 - Gr. B',
            'France - National 2 - Gr. C',
            'France - National 2 - Gr. D',
            'Georgia - Erovnuli Liga 2',
            'Germany - Bundesliga Women',
            'Germany - Oberliga Baden-W.',
            'Germany - Oberliga Baden-W.',
            'Germany - Oberliga Bayern Nord',
            'Germany - Oberliga Bayern Nord',
            'Germany - Oberliga Bayern Sï¿½d',
            'Germany - Oberliga Bayern Süd',
            'Germany - Oberliga Bremen',
            'Germany - Oberliga Bremen',
            'Germany - Oberliga Hamburg',
            'Germany - Oberliga Hessen',
            'Germany - Oberliga Niederrhein',
            'Germany - Oberliga Niedersachsen',
            'Germany - Oberliga Rheinland-P/S',
            'Germany - Oberliga Schleswig H.',
            'Germany - Oberliga Westfalen',
            'Germany - Oberliga Westfalen',
            'Germany - Oberliga Mittelrhein',
            'Germany - Regionalliga Bayern',
            'Germany - Regionalliga Nord',
            'Germany - Regionalliga Nord',
            'Germany - Regionalliga Nordost',
            'Germany - Regionalliga Südwest',
            'Germany - Regionalliga West',
            'Germany - Oberliga NOFV Nord',
            'Germany - Regionalliga Sï¿½dwest',
            'Iceland - 2. Deild',
            'Iceland - 3. Deild',
            'Italy - Primavera 1',
            'Japan - J3 League',
            'Japan - Nadeshiko League Women',
            'Malawi - Super League',
            'Malaysia - Premier League',
            'Malta - Challenge League',
            'Mexico - Liga MX U20 - Apertura',
            'Netherlands - Derde d. Zaterdag',
            'Netherlands - Derde d. Zondag',
            'Netherlands - Tweede Divisie',
            'Norway - Division 3 - Gr. 1',
            'Poland - 2. Liga',
            'Scotland - Highland League',
            'Scotland - League Two',
            'Serbia - Srpska Liga - East',
            'Slovakia - 2. Liga',
            'South Korea - K3 League',
            'Sweden - Div 2 - N Götaland',
            'Sweden - Div 2 - N Svealand',
            'Sweden - Div 2 - Norrland',
            'Sweden - Div 2 - S Götaland',
            'Sweden - Div 2 - S Svealand',
            'Sweden - Div 2 - V Götaland',
            'Switzerland - Promotion League',
            'Tajikistan - Vysshaya Liga',
            'Turkey - 2. Lig Red Group',
            'Turkey - 2. Lig White Group',
            'Turkey - 3. Lig Group 1',
            'Turkey - 3. Lig Group 2',
            'Turkey - 3. Lig Group 3',
            'Ukraine - Druha Liga - Gr. A',
            'Ukraine - Persha Liga',
            'USA - USL League One',
            'Vietnam - V League ',
            'Vietnam - National League Women',
            ];


        return leagueBlackList.find(element => element===league);

    },
    isLeagueInWhiteList(league) {
        const leagueBlackList = [
            'Algeria - Ligue 1',
            'Argentina - Liga Profesional',
            'Argentina - Primera Nacional',
            'Austria - Bundesliga',
            'Austria - 2. Liga',
            'Belarus - Premier League',
            'Belgium - First Division A',
            'Bolivia - Primera Div. - Apertura',
            'Bosnia and Herzegovina - Premier Liga',
            'Brazil - Serie A',
            'Brazil - Serie B',
            'Bulgaria - Parva Liga',
            'Canada - Premier League',
            'Chile - Primera Division',
            'Chile - Primera B',
            'China - Super League',
            'China - League One',
            'Colombia - Primera A - Apertura',
            'Croatia - 1. HNL',
            'Denmark - Superligaen',
            'Denmark - 1st Division',
            'Ecuador - Liga Pro 1st Stage',
            'Egypt - Premier League',
            'England - Premier League',
            'England - Championship',
            'England - League One',
            'Estonia - Meistriliiga',
            'FaroeIslands - Premier League',
            'Finland - Veikkausliiga',
            'Finland - Ykkonen',
            'Finland - Kakkonen Group A',
            'Finland - Kakkonen Group B',
            'Finland - Kakkonen Group C',
            'France - Ligue 1',
            'France - Ligue 2',
            'Georgia - Erovnuli Liga',
            'Germany - Bundesliga',
            'Germany - 2. Bundesliga',
            'Germany - 3. Liga',
            'Greece - Super League',
            'Hungary - NB I',
            'Iceland - Urvalsdeild',
            'Iceland - 1. Deild',
            'India - Super League',
            'Indonesia - Liga 1',
            'Iran - Pro League',
            'Ireland - Premier Division',
            'Israel - Ligat HaAl',
            'Italy - Serie A',
            'Italy - Serie B',
            'Japan - J1 League',
            'Japan - J2 League',
            'Jordan - Premier League',
            'Kazakhstan - Premier League',
            'Latvia - Virsliga',
            'Lithuania - A Lyga',
            'Lithuania - 1st League',
            'Luxembourg - National Division',
            'Malaysia - Super League',
            'Mexico - Liga MX - Apertura',
            'Mexico - Liga MX - Clausura',
            'Moldova - Divizia Nationala',
            'Mongolia - Premier League',
            'Montenegro - First League',
            'Morocco - Botola Pro',
            'Netherlands - Eredivisie',
            'Netherlands - Eerste Divisie',
            'Northern Ireland - NIFL Premiership',
            'Norway - Eliteserien',
            'Norway - 1st Division',
            'Paraguay - Primera Div. - Apertura',
            'Peru - Liga 1 - Apertura',
            'Peru - Liga 1 - Clausura',
            'Peru - Liga 2 - Apertura',
            'Peru - Liga 2 - Clausura',
            'Poland - Ekstraklasa',
            'Poland - 1. Liga',
            'Portugal - Liga Portugal',
            'Portugal - Liga Portugal 2',
            'Qatar - Stars League',
            'Romania - Liga 1',
            'Russia - Premier League',
            'Saudi Arabia - Professional League',
            'Scotland - Premiership',
            'Scotland - Championship',
            'Serbia - Super Liga',
            'Singapore - Premier League',
            'Slovakia - Fortuna Liga',
            'Slovenia - PrvaLiga',
            'South Korea - K League 1',
            'South Korea - K League 2',
            'Spain - La Liga',
            'Spain - La Liga 2',
            'Sweden - Allsvenskan',
            'Sweden - Superettan',
            'Switzerland - Super League',
            'Switzerland - Challenge League',
            'Thailand - Thai League 1',
            'Turkey - Super Lig',
            'Turkey - 1. Lig',
            'Turkey - 3. Lig Group 3',
            'UAE - Pro League',
            'Ukraine - Premier League',
            'Uruguay - Primera Division - Apertura',
            'Uruguay - Primera Division - Clausura',
            'USA - MLS',
            'USA - USL Championship',
            'Venezuela - Primera Division',
            'Vietnam - V League',
            'Wales - Cymru Premier',
        ];


        return leagueBlackList.find(element => element===league);

    }
}
