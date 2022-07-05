const fs = require('fs');
Feature('SoccerStats Data extraction').tag('@scrapper');

Scenario('Extract visible Data from SoccerStats', async ({ I, soccerStatsPage, clientPage}) => {
        let docs = [];

        soccerStatsPage.goToDailyMachtPageWithTermAndConditions();

        let playingLeagues = await soccerStatsPage.getPlayingLeagues(soccerStatsPage.locators.matchsTrsVisible);
        let matchesWithHomeAwayData = await soccerStatsPage.fillHomeAwayDataByPlayingLeagues(playingLeagues);
        let matchesWithFirstGoalStats = await soccerStatsPage.fillFirstGoalStats(matchesWithHomeAwayData);

        matchesWithFirstGoalStats.forEach((league)=> {
           docs.push(league.toJson());
        });

        soccerStatsPage.goToDailyMachtPage();

        playingLeagues = await soccerStatsPage.getPlayingLeagues(soccerStatsPage.locators.matchsTrsHidden);
        matchesWithHomeAwayData = await soccerStatsPage.fillHomeAwayDataByPlayingLeagues(playingLeagues);
        matchesWithFirstGoalStats = await soccerStatsPage.fillFirstGoalStats(matchesWithHomeAwayData);

        matchesWithFirstGoalStats.forEach((league)=> {
                docs.push(league.toJson());
        });

        const jsonContent = JSON.stringify(docs);
        try {
                fs.writeFileSync('./output/testToday.json', jsonContent, 'utf8');
                // file written successfully
        } catch (err) {
                console.error(err);
        }

}).retry(5);
