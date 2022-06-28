
class match {
    time;
    homeTeam;
    awayTeam;

    constructor(time, homeTeam, awayTeam) {
        this.time = time;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
    }

    get time() {
        return this.time;
    }

    get homeTeam() {
        return this.homeTeam;
    }

    get awayTeam() {
        return this.awayTeam;
    }

    get fullMatch() {
        return this.homeTeam.name + ' vs ' + this.awayTeam.name + ' at ' + this.time
    }
}

module.exports = match;
