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

        const jsonContent = JSON.stringify(docs);
        try {
                fs.writeFileSync('./output/testVisible.json', jsonContent, 'utf8');
                // file written successfully
        } catch (err) {
                console.error(err);
        }

        if (docs.length > 0) {
                //await clientPage.saveData(docs);
        }

}).retry(5);

Scenario('Extract hidden Data from SoccerStats', async ({ I, soccerStatsPage, clientPage}) => {
        let docs = [];

        soccerStatsPage.goToDailyMachtPageWithTermAndConditions();

        let playingLeagues = await soccerStatsPage.getPlayingLeagues(soccerStatsPage.locators.matchsTrsHidden);
        let matchesWithHomeAwayData = await soccerStatsPage.fillHomeAwayDataByPlayingLeagues(playingLeagues);
        let matchesWithFirstGoalStats = await soccerStatsPage.fillFirstGoalStats(matchesWithHomeAwayData);

        matchesWithFirstGoalStats.forEach((league)=> {
                docs.push(league.toJson());
        });

        const jsonContent = JSON.stringify(docs);
        try {
                fs.writeFileSync('./output/testHidden.json', jsonContent, 'utf8');
                // file written successfully
        } catch (err) {
                console.error(err);
        }

        if (docs.length > 0) {
                //await clientPage.saveData(docs);
        }
}).retry(5);
