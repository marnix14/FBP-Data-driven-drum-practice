class Visualization {
    margin = 100;
    metronome;
    radius;
    exercise;
    subdivision;
    hitRadius = 40;
    startY;
    endY;

    opacity;
    spacing;
    sw;
    shape;
    size;




    heightOffset;

    constructor(metronome, exercise) {
        console.log('visualization initialized');
        this.metronome = metronome;
        this.exercise = exercise;
    }
    setup() {
        this.radius = min(width, height) / 2 - this.margin;
        this.endY = this.margin;
        this.startY = height - this.margin;
        this.setSpacing(100);
        this.setOpacity(255);
        this.setStrokeWeight(3);
        this.setShape('circle');
        this.setSize(0.2);




    }
    display() {
        this.displayExercise();
        this.displayMetronome();
        // this.drawLargeCircle();
        // this.drawArc();
        // this.drawBeats();
    }


    displayMetronome() {
        stroke(255);
        //noFill();
        textSize(50);
        noStroke();
        fill(255);

        //text(this.metronome.bpm, width/2-450, 500);
    }


    displayExercise() {
        let lineLength = this.endY - this.startY
        let offset = this.metronome.getOffset();
        let positionFractionSum = 0;


        //draw beats
        stroke(255);
        strokeWeight(2);
        for (let i = 0; i < this.metronome.beatsPerBar; i++) {
            let y = this.startY + ((i / this.metronome.beatsPerBar - offset + 1) % 1) * lineLength;
            if (i == 0) {
                                line(width / 2 - 20, y, width / 2 + 20, y)
            } else {
                line(width / 2 - 5, y, width / 2 + 5, y)
            }
        }

        //draw center line
        //strokeWeight(2);
        //line(width / 2, this.startY, width / 2, this.endY);

        //draw strokes
        for (let i = 0; i < this.exercise.numberOfStrokes; i++) {
            let y = this.startY + ((positionFractionSum - offset + 1) % 1) * lineLength;
            this.exercise.strokes[i].display(width / 2, y, this.shape, this.size, this.spacing, this.opacity, this.sw);
            positionFractionSum += this.exercise.strokes[i].subdivision / this.exercise.exerciseLength;
        }
        //draw hit indication line
        stroke(255, 0, 0);
        strokeWeight(5);
        line(width / 2 - 50, this.startY, width / 2 + 50, this.startY);
    }

    setOpacity(opacity) {
        this.opacity = opacity;
    }
    setSpacing(spacing) {
        this.spacing = spacing;
    }
    setStrokeWeight(sw) {
        this.sw = sw;
    }
    setShape(shape) {
        this.shape = shape;
    }
    setSize(size){
        this.size = size;
    }
}