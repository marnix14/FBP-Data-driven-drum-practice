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

        this.resetButton = createButton("");
        this.resetButton.mousePressed(() => {
            this.drumScroll.reset();
        });
        this.resetButton.position(
            this.drumScroll.centerX - this.drumScroll.width / 2 - 45,
            this.drumScroll.bottom - 18
        );
        this.resetButton.class("resetButton disabled");

        this.playPause = createButton("");
        this.playPause.class("playPauseButton play");
        this.playPause.position(this.drumScroll.centerX - this.drumScroll.width / 2 - 10, this.drumScroll.bottom - 20);
        this.playPause.mousePressed(() => {
            this.togglePlayButton();
        });

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

        this.drumScroll.addEventCallback((e) => {
            this.updatePlayPauseResetButton();
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
        this.updatePlayPauseResetButton();
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
        this.updatePlayPauseResetButton();
        this.updateRecordButton();
    }

    updatePlayPauseResetButton() {
        if (this.drumScroll.exerciseSession.isRecording) {
            this.resetButton.addClass("disabled");
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
            if (this.drumScroll.metronome.barPosition > 0) {
                this.resetButton.removeClass("disabled");
            } else {
                this.resetButton.addClass("disabled");
            }
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
        switch (keyCode) {
            case 32: // spacebar
                this.togglePlayButton();
                break;
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
