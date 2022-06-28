class firstGoalStatsTeam {
    team;
    gamePlayed;
    homeScoreFirst;
    homeNoGoal;
    homeConcededFirst;
    awayScoreFirst;
    awayNoGoal;
    awayConcededFirst;


    constructor(team, gamePlayed, homeScoreFirst, homeNoGoal, homeConcededFirst, awayScoreFirst, awayNoGoal, awayConcededFirst) {
        this.team = team;
        this.gamePlayed = gamePlayed;
        this.homeScoreFirst = homeScoreFirst;
        this.homeNoGoal = homeNoGoal;
        this.homeConcededFirst = homeConcededFirst;
        this.awayScoreFirst = awayScoreFirst;
        this.awayNoGoal = awayNoGoal;
        this.awayConcededFirst = awayConcededFirst;
    }


    get team() {
        return this.team;
    }

    get gamePlayed() {
        return this.gamePlayed;
    }

    get homeScoreFirst() {
        return this.homeScoreFirst;
    }

    get homeNoGoal() {
        return this.homeNoGoal;
    }

    get homeConcededFirst() {
        return this.homeConcededFirst;
    }

    get awayScoreFirst() {
        return this.awayScoreFirst;
    }

    get awayNoGoal() {
        return this.awayNoGoal;
    }

    get awayConcededFirst() {
        return this.awayConcededFirst;
    }
}

module.exports = firstGoalStatsTeam;
