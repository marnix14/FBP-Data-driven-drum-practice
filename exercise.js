class Exercise {
    name;
    sticking;
    subdivision;

    constructor(name, sticking, subdivision) {
        this.name = name;
        this.sticking = sticking;
        this.subdivision = subdivision;
        this.fillStrokeArray();
    }
    static fromRudimentJSON(rudimentJson) {
        return new Exercise(rudimentJson.name, rudimentJson.sticking, rudimentJson.subdivision);
    }

    fillStrokeArray() {
        for (let i = 0; i < this.name.length; i++) {
            const stickingChar = this.sticking.substring(i, i + 1);
            this.hits.push(Hit.fromStickingChar(stickingChar));
        }
    }
}
