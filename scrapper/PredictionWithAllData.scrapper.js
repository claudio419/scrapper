Feature('test').tag('@test');

Scenario('Test', async ({ I, clientPage, predictionPage}) => {
    const leagues = await clientPage.getAllLeagues();
    console.log(leagues);
});
