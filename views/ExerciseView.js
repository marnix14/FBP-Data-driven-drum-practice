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
        if (this.drumScroll) {
            this.drumScroll.setExerciseSession(this.exerciseSession);
        } else {
            this.drumScroll = new DrumScroll(this.exerciseSession);
        }
    }

    setup() {
        const scrollHeight = height * 0.6;
        const scrollWidth = scrollHeight / 2;
        const scrollX = width / 2 - scrollWidth / 2;
        const scrollY = height / 2 - scrollHeight / 2;
        this.drumScroll.setBounds(scrollX, scrollY, scrollWidth, scrollHeight);

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
        this.pauseButton.position(75, 10);
        this.pauseButton.class("button4");

        this.resetButton = createButton("reset");
        this.resetButton.mousePressed(() => {
            this.drumScroll.reset();
        });
        this.resetButton.position(150, 10);
        this.resetButton.class("button4");

        this.tempoSlider = createSlider(30, 200, 100);
        this.tempoSlider.class("slider");
        this.tempoSlider.input(() => this.drumScroll.metronome.setBeatsPerMinute(this.tempoSlider.value()));
        this.tempoSlider.position(80, 50);
    }
    update() {
        // TODO
        this.drumScroll.update();
    }

    draw() {
        this.drumScroll.draw();
    }
}
