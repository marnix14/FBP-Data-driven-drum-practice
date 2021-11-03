class DrumScroll extends Metronome {
    exercise;

    setExercise(exercise) {
        this.exercise = exercise;
    }

    play(beatOffset) {
        super.play(beatOffset);
    }

    pause() {
        super.pause();
    }

    reset() {
        super.reset();
    }

    update() {
        super.update();
    }

    draw() {
        fill(255);
        textSize(50);
        text(this.beatsPerMinute, 20, 100);

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
