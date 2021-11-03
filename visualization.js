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

        text(this.metronome.bpm, 20, 100);
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
                line(width / 2 - 50, y, width / 2 + 50, y)
            } else {
                line(width / 2 - 20, y, width / 2 + 20, y)
            }
        }

        //draw center line
        strokeWeight(2);
        line(width / 2, this.startY, width / 2, this.endY);

        //draw strokes
        for (let i = 0; i < this.exercise.numberOfStrokes; i++) {
            let y = this.startY + ((positionFractionSum - offset + 1) % 1) * lineLength;
            this.exercise.strokes[i].display(width / 2, y, this.shape, this.spacing, this.opacity, this.sw);
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
}





// drawLargeCircle() {
//     strokeWeight(10);
//     stroke(255);
//     noFill();
//     ellipse(width / 2, height / 2, 2 * this.radius, 2 * this.radius);
// }

// drawArc() {
//     let angle = this.metronome.getOffset() * 2 * PI % (2 * PI);
//     strokeWeight(10);
//     stroke(255);
//     noFill();
//     arc(width / 2, height / 2, 2 * this.radius - 20, 2 * this.radius - 20, PI * 1.5, angle);
// }

// drawBeats() {
//     stroke(255);
//     strokeWeight(5);
//     noFill();

//     for (let i = 0; i < metronome.beatsPerBar; i++) {
//         let angle = 2 * PI / metronome.beatsPerBar * i;
//         let x = width / 2 + cos(angle) * this.radius;
//         let y = height / 2 + sin(angle) * this.radius;
//         ellipse(x, y, 50, 50);
//     }
// }
