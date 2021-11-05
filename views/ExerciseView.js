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

        this.resetButton = createButton("reset");
        this.resetButton.mousePressed(() => {
            this.drumScroll.reset();
        });
        this.resetButton.position(20, 10);
        this.resetButton.class("button4");

        this.tempoSlider = createSlider(30, 200, 100);
        this.tempoSlider.class("slider");
        this.tempoSlider.input(() => this.drumScroll.metronome.setBeatsPerMinute(this.tempoSlider.value()));
        this.tempoSlider.position(80, 50);

        this.recordButton = createButton("");
        this.recordButton.class("recordButton");
        this.recordButton.position(
            this.drumScroll.centerX + this.drumScroll.width / 2 - 25,
            this.drumScroll.bottom - 13
        );
        this.recordButton.mousePressed(() => {
            this.toggleRecordButton();
        });

        this.playPause = createButton("");
        this.playPause.class("playPauseButton play");
        this.playPause.position(this.drumScroll.centerX - this.drumScroll.width / 2 + 2, this.drumScroll.bottom - 23);
        this.playPause.mousePressed(() => {
            this.togglePlayButton();
        });

        this.drumScroll.addEventCallback((e) => {
            console.log(e);
            this.updatePlayPauseButton();
            this.updateRecordButton();
        });
    }

    toggleRecordButton() {
        if (this.drumScroll.exerciseSession.isRecording) {
            this.drumScroll.stop();
        } else {
            this.drumScroll.startRecording();
        }
        this.updateRecordButton();
        this.updatePlayPauseButton();
    }

    updateRecordButton() {
        if (this.drumScroll.exerciseSession.isRecording) {
            this.recordButton.class("recordButton fillRecording emitLightRecording");
        } else {
            this.recordButton.class("recordButton");
        }
    }

    togglePlayButton() {
        this.drumScroll.togglePlay();
        this.updatePlayPauseButton();
        this.updateRecordButton();
    }

    updatePlayPauseButton() {
        if (this.drumScroll.exerciseSession.isRecording) {
            this.playPause.addClass("disabled");
        } else {
            this.playPause.removeClass("disabled");
        }
        if (this.drumScroll.metronome.isPlaying) {
            this.playPause.removeClass("play");
            this.playPause.addClass("pause");
        } else {
            this.playPause.removeClass("pause");
            this.playPause.addClass("play");
        }
    }

    update() {
        // TODO
        this.drumScroll.update();
    }

    draw() {
        this.drumScroll.draw();
    }

    keyPressed() {
        console.log(keyCode);
        // spacebar
        switch (keyCode) {
            case 32:
                this.togglePlayButton();
                break; // spacebar
            case LEFT_ARROW:
                this.drumScroll.reset();
                break;
            case ESCAPE:
            case BACKSPACE:
                this.drumScroll.stop();
                break;
            case ENTER:
                this.toggleRecordButton();
                break;
        }
    }
}
