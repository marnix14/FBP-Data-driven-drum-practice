class DrumScroll {
    metronome = new Metronome();
    exerciseSession;

    constructor(exerciseSession) {
        this.exerciseSession = exerciseSession;
    }

    play(beatOffset) {
        this.metronome.play(beatOffset);
    }

    pause() {
        this.metronome.pause();
    }

    reset() {
        this.metronome.reset();
    }

    update() {
        this.metronome.update();
    }

    draw() {
        fill(255);
        textSize(50);
        text(this.metronome.beatsPerMinute, 20, 100);

        if (this.exercise) {
            this.drawExercise();
        }
    }

    drawExercise() {
        for (const hit of this.exercise.hits) {
            this.drawHit(hit);
        }
    }

    drawHit(stroke) {
        strokeWeight(10);
        stroke(255);
        noFill();
        circle(30, 30, 20);
    }
}
