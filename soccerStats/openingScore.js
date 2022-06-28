class openingScore {
    team;
    openScore;
    averageMinute;
    firstQuarter;
    secondQuarter;
    thirdQuarter;
    fourthQuarter;
    fivethQuarter;
    sixthQuarter;
    firstHalf;
    secondHalf;


    constructor(team, openScore, averageMinute, firstQuarter, secondQuarter, thirdQuarter, fourthQuarter, fivethQuarter, sixthQuarter, firstHalf, secondHalf) {
        this.team = team;
        this.openScore = openScore;
        this.averageMinute = averageMinute;
        this.firstQuarter = firstQuarter;
        this.secondQuarter = secondQuarter;
        this.thirdQuarter = thirdQuarter;
        this.fourthQuarter = fourthQuarter;
        this.fivethQuarter = fivethQuarter;
        this.sixthQuarter = sixthQuarter;
        this.firstHalf = firstHalf;
        this.secondHalf = secondHalf;
    }

}

module.exports = openingScore;
