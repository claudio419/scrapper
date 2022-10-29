const fs = require('fs');
const log = require('log-beautify');
const axios = require("axios");
let nextThreePages = new DataTable(['param', 'date']);

log.useSymbols = true

log.setSymbols({
        danger: "⛔ ",
        error: "👎 ",
        ok: "👍 ",
        success: "✅ ",
        info: "❗",
});

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

Feature('SoccerStats Leagues Data extraction').tag('@leagues');

Data(nextThreePages).Scenario('Extract Leagues Data from SoccerStats', async ({ I, current, soccerStatsPage, clientPage}) => {


        if (fs.existsSync('./tmp/playingLeaguesTemp' +  current.date + '.json')) {
                log.info('File exist ');
                return;
        }

        let options = {
                headers: {
                        'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'
                }
        }
        let res = await axios.get(`${process.env.SOCCERSTATS_URL}matches.asp?matchday=${current.param}`, options);
        let html = res.data.replace(/<script[^>]*>(?:(?!<\/script>)[^])*<\/script>/g, "");

        if (!fs.existsSync('./tmp/')) {
                fs.mkdirSync('./tmp/');
        }

        fs.writeFileSync(
            './tmp/test' +  current.date + '.html',
            html
        );

        I.amOnPage(process.env.LOCALHOST_URL +  current.date + '.html');

        I.say('I grab visible match');
        let playingLeagues = await soccerStatsPage.getPlayingLeagues('#content > div:nth-child(2) > div > table:nth-child(13) > tbody > tr > td > table > tbody > tr');

        let docs = [];
        if (playingLeagues.length === 0) {
                log.error('Leagues not found');
                return;
        }

        log.info('Playing Leagues: ' + playingLeagues.length);

        playingLeagues.forEach((league)=> {
                docs.push(league.toJson());
        });

        if (!fs.existsSync('./tmp/')) {
                fs.mkdirSync('./tmp/');
        }

        fs.writeFileSync(
            './tmp/playingLeaguesTemp' +  current.date + '.json',
            JSON.stringify(docs),
            'utf8'
        );
        log.success('Success');
});
