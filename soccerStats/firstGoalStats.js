class firstGoalStats {
    firstGoalStatsTable;
    homeOpeningGoalScoredTable;
    awayOpeningGoalScoredTable;
    homeOpeningGoalConcededTable;
    awayOpeningGoalConcededTable;


    constructor(firstGoalStatsTable, homeOpeningGoalScoredTable, awayOpeningGoalScoredTable, homeOpeningGoalConcededTable, awayOpeningGoalConcededTable) {
        this.firstGoalStatsTable = firstGoalStatsTable;
        this.homeOpeningGoalScoredTable = homeOpeningGoalScoredTable;
        this.awayOpeningGoalScoredTable = awayOpeningGoalScoredTable;
        this.homeOpeningGoalConcededTable = homeOpeningGoalConcededTable;
        this.awayOpeningGoalConcededTable = awayOpeningGoalConcededTable;
    }
}

module.exports = firstGoalStats
