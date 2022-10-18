/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');
type soccerStatsPage = typeof import('./pages/soccerStats.page.js');
type clientPage = typeof import('./client/client.page.js');
type predictionPage = typeof import('./predictions/prediction.page.js');
type predictionNewPage = typeof import('./predictions/predictionNew.page.js');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, soccerStatsPage: soccerStatsPage, clientPage: clientPage, predictionPage: predictionPage, predictionNewPage: predictionNewPage }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
