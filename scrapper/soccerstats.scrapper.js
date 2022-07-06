const fs = require('fs');

Feature('SoccerStats Data extraction').tag('@scrapper');


Scenario('Extract visible Data from SoccerStats', async ({ I, soccerStatsPage, clientPage}) => {
        const today = new Date()
        let dayDate = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
        soccerStatsPage.goToDailyMachtPageWithTermAndConditions(0);

        for (let matchdayParams = 1; matchdayParams<4; matchdayParams++)  {


                if (fs.existsSync('./output/scrapperSoccerStats_' + dayDate +'.json')) {
                        dayDate = today.setDate(new Date().getDate()+matchdayParams);
                        dayDate = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
                        continue;
                }

                let docs = [];

                I.say(`I go to page number ${matchdayParams}`);

                soccerStatsPage.goToDailyMachtPage(matchdayParams);

                let playingLeagues = await soccerStatsPage.getPlayingLeagues(soccerStatsPage.locators.matchsTrsVisible);
                let hiddenMatchs = await soccerStatsPage.getPlayingLeagues(soccerStatsPage.locators.matchsTrsHidden);
                playingLeagues.push(... hiddenMatchs);

                I.say(`PlayinLeagues are ${playingLeagues.length}`);

                let matchesWithHomeAwayData = await soccerStatsPage.fillHomeAwayDataByPlayingLeagues(playingLeagues);
                soccerStatsPage.goToDailyMachtPage(matchdayParams);
                let matchesWithFirstGoalStats = await soccerStatsPage.fillFirstGoalStats(matchesWithHomeAwayData);
                soccerStatsPage.goToDailyMachtPage(matchdayParams);

                matchesWithFirstGoalStats.forEach((league)=> {
                   docs.push(league.toJson());
                });

                const jsonContent = JSON.stringify(docs);
                try {
                         fs.writeFileSync('./output/scrapperSoccerStats_' + dayDate +'.json', jsonContent, 'utf8');
                        dayDate = today.setDate(new Date().getDate()+matchdayParams);
                        dayDate = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
                } catch (err) {
                        console.error(err);
                }

        }

});
