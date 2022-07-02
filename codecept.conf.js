require('dotenv-defaults/config');

exports.config = {
  tests: './scrapper/*.scrapper.js',
  output: './output',
  helpers: {
    Playwright: {
      url: '',
      show: process.env.HEADLESS,
      browser: 'chromium',
      waitForNavigation: "domcontentloaded",
      waitForAction: 5000,
    }
  },
  include: {
    I: './steps_file.js',
    soccerStatsPage: './pages/soccerStats.page.js',
    clientPage:  './client/client.page.js',
    predictionPage: './predictions/prediction.page.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'stats_web_scrapper',
  plugins: {
    eachElement:{}
  }
}
