const fs = require('fs');
const log = require('log-beautify');
const axios = require("axios");
let yesterdayDate = new DataTable(['param', 'date']);

log.useSymbols = true

log.setSymbols({
    danger: "⛔ ",
    error: "👎 ",
    ok: "👍 ",
    success: "✅ ",
    info: "❗",
});

const date = new Date();
//Subtract one day from it
date.setDate(date.getDate()-1);

const dayDateYesterday = date.getFullYear()+'_'+(date.getMonth()+1)+'_'+date.getDate();




yesterdayDate.add(['0', dayDateYesterday]);


Feature('SoccerStats Games Played Data extraction').tag('@gamesPlayed');

Data(yesterdayDate).Scenario('Extract Games Played Data from SoccerStats', async ({ I, current, soccerStatsPage, clientPage}) => {


    if (fs.existsSync('./tmp/gamesPlayed' +  current.date + '.json')) {
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
        './tmp/gamesPlayed' +  current.date + '.html',
        html
    );


    I.amOnPage('http://localhost:63342/stats_web_scrapper/tmp/gamesPlayed' +  current.date + '.html');

    I.say('I grab visible match');
    let playedGames = await soccerStatsPage.getPlayedGames('#content > div:nth-child(2) > div > table:nth-child(3) > tbody > tr > td > table > tbody > tr');
    let docs = [];
    if (playedGames.length === 0) {
        log.error('Leagues not found');
        return;
    }

    log.info('Playing Leagues: ' + playedGames.length);

    playedGames.forEach((league)=> {
        docs.push(league);
    });

    if (!fs.existsSync('./tmp/')) {
        fs.mkdirSync('./tmp/');
    }

    fs.writeFileSync(
        './tmp/gamesPlayed' +  current.date + '.json',
        JSON.stringify(docs),
        'utf8'
    );
    log.success('Success');
});
