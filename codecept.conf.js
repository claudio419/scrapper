require('dotenv-defaults/config');

exports.config = {
  tests: './scraper/*.scraper.js',
  output: './output',
  helpers: {
    Playwright: {
      url: '',
      show: process.env.HEADLESS === 'true',
      browser: 'chromium',
      waitForNavigation: "domcontentloaded",
      waitForAction: 50000,
      trace: true,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
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
