class leagues {
    league;
    statsUrl;
    matches = [];
    homeTable = [];
    awayTable = [];
    firstGoalStats = [];

    constructor(league, statsUrl) {
        this.league = league;
        this.statsUrl = statsUrl;
    }


    get league() {
        return this.league;
    }

    get statsUrl() {
        return this.statsUrl;
    }

    getMatches() {
        return this.matches;
    }

    setMatches(value) {
        this.matches.push(value);
    }

    get homeTable() {
        return this.homeTable;
    }

    setHomeTable(value) {
        this.homeTable = value;
    }

    get awayTable() {
        return this.awayTable;
    }

    setAwayTable(value) {
        this.awayTable = value;
    }

    setFirstGoalStats(value) {
        this.firstGoalStats = value;
    }

    getLeagueDataMatchesWithHomeAway() {
        console.log(this.league);
        let match;
        let homeTeam;
        let awayTeam;
        for(let x =0; x < this.matches.length; x++) {
            match = this.matches[x];
            homeTeam = match.homeTeam.name;
            awayTeam = match.awayTeam.name;

            console.log(homeTeam, '\n');
            console.log(awayTeam, '\n');
        }
    }

    toJson() {
        return {
            league: this.league,
            statsUrl: this.statsUrl,
            matches:  JSON.parse(JSON.stringify(this.matches)),
            homeTable: JSON.parse(JSON.stringify(this.homeTable)),
            awayTable: JSON.parse(JSON.stringify(this.awayTable)),
            firstGoalStats: JSON.parse(JSON.stringify(this.firstGoalStats)),
        }
    }
}

module.exports = leagues;
