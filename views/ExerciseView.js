class ExerciseView {
    drumScroll;
    exercise;
    exerciseSession;

    constructor() {
        this.setExercise(Exercise.EMPTY);
    }

    setExercise(exercise) {
        this.exercise = exercise;
        this.exerciseSession = new ExerciseSession(exercise);
        this.drumScroll = new DrumScroll(this.exerciseSession);
    }

    setup() {
        this.playButton = createButton("play");
        this.playButton.mousePressed(() => {
            this.drumScroll.play(0);
        });
        this.playButton.parent("sketch");
        this.playButton.position(10, 10);
        this.playButton.class("button4");

        this.pauseButton = createButton("pause");
        this.pauseButton.mousePressed(() => {
            this.drumScroll.pause();
        });
        this.pauseButton.position(100, 10);
        this.pauseButton.class("button4");

        this.resetButton = createButton("reset");
        this.resetButton.mousePressed(() => {
            this.drumScroll.reset();
        });
        this.resetButton.position(200, 10);
        this.resetButton.class("button4");

        this.tempoSlider = createSlider(60, 1000, 174);
        this.tempoSlider.class("slider");
        this.tempoSlider.input(() => this.drumScroll.metronome.setBeatsPerMinute(this.tempoSlider.value()));
        this.tempoSlider.position(500, 0);
    }

    update() {
        // TODO
        this.drumScroll.update();
    }

    draw() {
        this.drumScroll.draw();
    }
}
