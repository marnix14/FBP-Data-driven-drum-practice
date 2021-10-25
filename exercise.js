class Exercise {
    name;
    sticking;
    strokes = [];
    subdivision;
    numberOfStrokes;
    exerciseLength;


    constructor(name, sticking, subdivision, exerciseLength) {
        this.exerciseLength=exerciseLength;
        this.name = name;
        this.sticking = sticking;
        this.subdivision = subdivision;
        this.numberOfStrokes = this.sticking.length;
        console.log(this.sticking);
        this.fillStrokeArray();
    }

    fillStrokeArray() {

        for (let i = 0; i < this.numberOfStrokes; i++) {
            let hit = this.sticking.substring(i, i + 1);
            this.strokes.push(new Stroke(hit, this.subdivision));
        }
        console.log('strokes', this.strokes);

    }


}



