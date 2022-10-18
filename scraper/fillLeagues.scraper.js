const fs = require('fs');

const open = require('fs/promises');

const JSONStream = require("JSONStream");
const axios = require("axios");
const DomParser = require('dom-parser');
let nextThreePages = new DataTable(['param', 'date']);
const events = require('events');


const today = new Date();
const dayDateToday = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();

today.setDate(new Date().getDate()+1); // Tomorrow
const dayDateTomorrow = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();

today.setDate(new Date().getDate()+2); // After tomorrow
const dayDateafterTomorrow =  today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate();

today.setDate(new Date().getDate()+3); // After 3 days
const afterFourDay =  today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate();

today.setDate(new Date().getDate()+4); // After 4 days
const afterFiveDay =  today.getFullYear()+'_'+(today.getMonth()+1)+'_'+ today.getDate();

nextThreePages.add(['1', dayDateToday]);
nextThreePages.add(['2', dayDateTomorrow]);
nextThreePages.add(['3', dayDateafterTomorrow]);
nextThreePages.add(['4', afterFourDay]);
nextThreePages.add(['5', afterFiveDay]);

Feature('SoccerStats fill Leagues Data').tag('@fillLeagues');

Data(nextThreePages).Scenario('Extract Data and fill Leagues from SoccerStats', async ({ I, current, soccerStatsPage, clientPage}) => {

        const json = JSON.parse(fs.readFileSync('./tmp/playingLeaguesTemp' +  current.date + '.json', 'utf8'));

        for (let x= 0; x<json.length; x++) {

                if (json[x].matches.length > 0) {
                        if (soccerStatsPage.isLeagueInBlackList(json[x].league)) {
                                console.log ('league', json[x].league, 'skipped');
                                continue;
                        }

                        if (!soccerStatsPage.isLeagueInWhiteList(json[x].league)) {
                                console.log ('league', json[x].league, 'skipped');
                                continue;
                        }

                        let league = json[x].league.replaceAll('/', '');

                        if (fs.existsSync('./tmp/league' + current.date + '/' + league + '.json')) {
                                console.log('file: ', './tmp/league' + current.date + '/' + league + '.json', 'exist');
                                continue;

                        }

                        let matchesData = await soccerStatsPage.fillHomeAwayDataByPlayingLeagues([json[x]]);
                        if (!matchesData) {
                                continue;
                        }
                        matchesData = await soccerStatsPage.fillFirstGoalStats(matchesData);

                        if (!fs.existsSync('./tmp/league' +  current.date + '/')) {
                                fs.mkdirSync('./tmp/league' + current.date + '/');
                        }

                        fs.writeFileSync(
                            './tmp/league' +  current.date + '/' + league + '.json',
                            JSON.stringify(matchesData),
                            'utf8'
                        );

                }
        }

});
