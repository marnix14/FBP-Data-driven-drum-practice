class DrumScroll extends Metronome {
    exercise;

    DrumScroll(exercise) {
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

        /*for (const stroke of this.exercise.strokes) {
        }*/
    }

    drawStroke() {}
}
