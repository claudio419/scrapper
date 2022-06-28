
class countryLeague{
    _countryLeagueName;
    _statsUrl;
    _matchedPlayed;
    _dataType;


    constructor(countryLeagueName, statsUrl, matchedPlayed, dataType) {
        this._countryLeagueName = countryLeagueName;
        this._statsUrl = statsUrl;
        this._matchedPlayed = matchedPlayed;
        this._dataType = dataType;
    }


    get countryLeagueName() {
        return this._countryLeagueName;
    }

    get statsUrl() {
        return this._statsUrl;
    }

    get matchedPlayed() {
        return this._matchedPlayed;
    }

    get dataType() {
        return this._dataType;
    }

    toJson() {
        return {
            countryLeagueName: this._countryLeagueName,
            statsUrl: this.statsUrl,
            matchedPlayed: this.matchedPlayed,
            dataType: this.dataType,
        }
    }
}

module.exports = countryLeague;
