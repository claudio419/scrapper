class team {
    name;
    matchTime;
    scope;
    gamePlayed;
    winningPercentageOfMatches;
    failedToScoreInPercentage;
    cleanSheetInPercentage;
    matchesWhereBothTeamsScoredInPercentage;
    totalGoalsScoreAndConcededPerMatch;
    goalScoredPerMatch;
    goalsConcededPerMatch;
    oneAndHalbGoal;
    twoAndHalbGoal;
    threeAndHalbGoal;
    pointsPerGame;
    dataType

    constructor(name,
                matchTime,
                scope,
                gamePlayed,
                winningPercentageOfMatches,
                failedToScoreInPercentage,
                cleanSheetInPercentage,
                matchesWhereBothTeamsScoredInPercentage,
                totalGoalsScoreAndConcededPerMatch,
                goalScoredPerMatch,
                goalsConcededPerMatch,
                oneAndHalbGoal,
                twoAndHalbGoal,
                threeAndHalbGoal,
                pointsPerGame,
                dataType)
    {
        this.name = name;
        this.matchTime = matchTime;
        this.scope = scope;
        this.gamePlayed = gamePlayed;
        this.winningPercentageOfMatches = winningPercentageOfMatches;
        this.failedToScoreInPercentage = failedToScoreInPercentage;
        this.cleanSheetInPercentage = cleanSheetInPercentage;
        this.matchesWhereBothTeamsScoredInPercentage = matchesWhereBothTeamsScoredInPercentage;
        this.totalGoalsScoreAndConcededPerMatch = totalGoalsScoreAndConcededPerMatch;
        this.goalScoredPerMatch = goalScoredPerMatch;
        this.goalsConcededPerMatch = goalsConcededPerMatch;
        this.oneAndHalbGoal = oneAndHalbGoal;
        this.twoAndHalbGoal = twoAndHalbGoal;
        this.threeAndHalbGoal = threeAndHalbGoal;
        this.pointsPerGame = pointsPerGame;
        this.dataType = dataType;
    }

    get name() {
        return this.name;
    }

    get matchTime() {
        return this.matchTime;
    }
    get scope() {
        return this.scope;
    }

    get gamePlayed() {
        return this.gamePlayed;
    }

    get winningPercentageOfMatches() {
        return this.winningPercentageOfMatches;
    }

    get failedToScoreInPercentage() {
        return this.failedToScoreInPercentage;
    }

    get cleanSheetInPercentage() {
        return this.cleanSheetInPercentage;
    }

    get matchesWhereBothTeamsScoredInPercentage() {
        return this.matchesWhereBothTeamsScoredInPercentage;
    }

    get totalGoalsScoreAndConcededPerMatch() {
        return this.totalGoalsScoreAndConcededPerMatch;
    }

    get goalScoredPerMatch() {
        return this.goalScoredPerMatch;
    }

    get goalsConcededPerMatch() {
        return this.goalsConcededPerMatch;
    }

    get oneAndHalbGoal() {
        return this.oneAndHalbGoal;
    }

    get twoAndHalbGoal() {
        return this.twoAndHalbGoal;
    }

    get threeAndHalbGoal() {
        return this.threeAndHalbGoal;
    }

    get pointsPerGame() {
        return this.pointsPerGame;
    }

    get dataType() {
        return this.dataType
    }
}

module.exports = team;
