const fs = require('fs');
let nextThreePages = new DataTable(['param', 'date'])

/*
* dayDate = today.setDate(new Date().getDate()+matchdayParams);
  dayDate = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
* */
const today = new Date();
const dayDateToday = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
today.setDate(new Date().getDate()+1); // Tomorrow
const dayDateTomorrow = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
today.setDate(new Date().getDate()+2); // After tomorrow
const dayDateafterTomorrow =  today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate();

nextThreePages.add(['1', dayDateToday]);
nextThreePages.add(['2', dayDateTomorrow]);
nextThreePages.add(['3', dayDateafterTomorrow]);

Feature('SoccerStats Data extraction').tag('@scrapper');

Data(nextThreePages).Scenario('Extract Data from SoccerStats', async ({ I, current, soccerStatsPage, clientPage}) => {

        soccerStatsPage.goToDailyMachtPageWithTermAndConditions(0);

        for (let matchdayParams = 1; matchdayParams<4; matchdayParams++)  {

                if (fs.existsSync('./output/scrapperSoccerStats_' + current.date +'.json')) {
                        return;
                }

                let docs = [];

                I.say(`I go to page number ${current.param}`);

                soccerStatsPage.goToDailyMachtPage(current.param);

                let playingLeagues = await soccerStatsPage.getPlayingLeagues(soccerStatsPage.locators.matchsTrsVisible);
                let hiddenMatchs = await soccerStatsPage.getPlayingLeagues(soccerStatsPage.locators.matchsTrsHidden);
                playingLeagues.push(... hiddenMatchs);
                hiddenMatchs = '';

                I.say(`PlayinLeagues are ${playingLeagues.length}`);

                let matchesData = await soccerStatsPage.fillHomeAwayDataByPlayingLeagues(playingLeagues);
                soccerStatsPage.goToDailyMachtPage(matchdayParams);
                matchesData = await soccerStatsPage.fillFirstGoalStats(matchesData);
                soccerStatsPage.goToDailyMachtPage(matchdayParams);

                matchesData.forEach((league)=> {
                   docs.push(league.toJson());
                });

                const jsonContent = JSON.stringify(docs);
                matchesData = '';
                try {
                         fs.writeFileSync('./output/scrapperSoccerStats_' + current.date +'.json', jsonContent, 'utf8');

                } catch (err) {
                        console.error(err);
                }

                docs = [];
                playingLeagues = '';
        }

});
