class Exercise {
    name;
    sticking;
    strokes = [];
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
            this.strokes.push(Stroke.fromStickingChar(stickingChar));
        }
    }
}
