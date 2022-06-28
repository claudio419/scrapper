
class position{
    teamName;
    gamePlayed;
    winning;
    draw;
    loosing;

    constructor(teamName, gamePlayed, winning, draw, loosing) {
        this.teamName = teamName;
        this.gamePlayed = gamePlayed;
        this.winning = winning;
        this.draw = draw;
        this.loosing = loosing;
    }

    get teamName() {
        return this.teamName;
    }

    get gamePlayed() {
        return this.gamePlayed;
    }

    get winning() {
        return this.winning;
    }

    get draw() {
        return this.draw;
    }

    get loosing() {
        return this.loosing;
    }
}

module.exports = position;
