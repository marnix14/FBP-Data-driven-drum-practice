// Represents database of rudiments
class Rudiments {
    static data = {};
    static abbrMap = {};

    static loadJSON(file) {
        console.log("Loading rudiments json: ", file);
        this.data = file;
        this.createAbbrMap();
    }

    static createAbbrMap() {
        for (const [group, rudiments] of Object.entries(this.data)) {
            for (const rudiment of rudiments) {
                this.abbrMap[rudiment.abbr] = rudiment;
                this.abbrMap[rudiment.abbr].group = group;
            }
        }
    }

    static getByAbbr(abbr) {
        return this.abbrMap[abbr];
    }
}
