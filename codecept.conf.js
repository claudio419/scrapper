require('dotenv-defaults/config');

exports.config = {
  tests: './scrapper/*.scrapper.js',
  output: './output',
  helpers: {
    Playwright: {
      url: '',
      show: process.env.HEADLESS === true,
      browser: 'chromium',
      waitForNavigation: "domcontentloaded",
      waitForAction: 5000,
      trace: true,
    }
  },
  include: {
    I: './steps_file.js',
    soccerStatsPage: './pages/soccerStats.page.js',
    clientPage:  './client/client.page.js',
    predictionPage: './predictions/prediction.page.js',
    predictionNewPage: './predictions/predictionNew.page.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'stats_web_scrapper',
  plugins: {
    eachElement:{}
  }
}
