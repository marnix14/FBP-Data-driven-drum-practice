class ExerciseView extends View {
    drumScroll;
    exercise;
    exerciseSession;

    constructor(exercise = Exercise.EMPTY) {
        super();
        this.setExercise(exercise);
        this.initUI();
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

    initUI() {
        const scrollHeight = height * 0.6;
        const scrollWidth = scrollHeight / 2;
        const scrollX = width / 2 - scrollWidth / 2;
        const scrollY = height * 0.1;
        this.drumScroll.setBounds(scrollX, scrollY, scrollWidth, scrollHeight);

        this.resetButton = new IconButton({
            x: this.drumScroll.centerX - this.drumScroll.width / 2 - 50,
            y: this.drumScroll.bottom - 20,
            icon: "reset",
            startDisabled: true,
            clicked: () => {
                this.drumScroll.reset();
            },
        });

        this.playPauseButton = new ToggleButton({
            x: this.drumScroll.centerX - this.drumScroll.width / 2 - 10,
            y: this.drumScroll.bottom - 20,
            iconOn: "pause",
            iconOff: "play",
            clickedOn: () => {
                this.drumScroll.play();
            },
            clickedOff: () => {
                this.drumScroll.pause();
            },
        });

        this.recordButton = new ToggleButton({
            x: this.drumScroll.centerX + this.drumScroll.width / 2 - 25,
            y: this.drumScroll.bottom - 13,
            size: 25,
            class: "recordButton",
            classOn: "recordOn",
            classOff: "recordOff",
            clickedOn: () => {
                this.drumScroll.startRecording();
            },
            clickedOff: () => {
                this.drumScroll.stop();
            },
        });

        this.tempoSlider = createSlider(30, 250, 100);
        this.tempoSlider.class("slider");
        this.tempoSlider.input(() => this.drumScroll.metronome.setBeatsPerMinute(this.tempoSlider.value()));
        this.tempoSlider.position(80, 50);

        this.exerciseSoundButton = new ToggleButton({
            x: this.drumScroll.centerX - 20,
            y: height - 70,
            iconOn: "snare",
            iconOff: "snare_mute",
            size: 47,
            clickedOn: () => {
                this.drumScroll.exerciseSoundPlayer.unmute();
            },
            clickedOff: () => {
                this.drumScroll.exerciseSoundPlayer.mute();
            },
        });

        this.focusSlider = createSlider(-1, 1, 0, 0);
        this.focusSlider.class("slider");
        this.focusSlider.style("width", `${this.drumScroll.width / 2}px`);
        this.focusSlider.input(() => this.drumScroll.exerciseSoundPlayer.setFocus(this.focusSlider.value()));
        this.focusSlider.position(this.drumScroll.centerX - this.drumScroll.width / 4, height - 100);
        this.focusSlider.doubleClicked(() => {
            this.focusSlider.value(0);
            this.drumScroll.exerciseSoundPlayer.setFocus(this.focusSlider.value());
        });

        this.drumScroll.addEventCallback((e) => {
            if (e === "stoppedRecording") {
                changeView(new AnalysisView(this.exerciseSession));
            }
            this.updateButtons();
        });
    }

    updateButtons() {
        if (this.drumScroll.metronome.isPlaying) {
            this.playPauseButton.setOn();
            this.resetButton.disable();
            if (this.drumScroll.exerciseSession.isRecording) {
                this.playPauseButton.disable();
            } else {
                this.playPauseButton.enable();
            }
        } else {
            this.playPauseButton.enable();
            this.playPauseButton.setOff();
            if (this.drumScroll.metronome.getBarPosition() > 0) {
                this.resetButton.enable();
            } else {
                this.resetButton.disable();
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
                this.playPauseButton.toggle();
                break;
            case 36: // home
                this.drumScroll.reset();
                break;
            case ESCAPE:
            case BACKSPACE:
                this.drumScroll.stop();
                break;
            case ENTER:
                this.recordButton.toggle();
                break;
        }
    }

    padInput(hit) {
        this.exerciseSession.padInput(TimedHit.fromHitAndMetronome(hit, this.drumScroll.metronome));
    }

    getAnalysisView() {
        return new AnalysisView(this.exerciseSession);
    }

    destroy() {
        this.tempoSlider.remove();
        this.resetButton.remove();
        this.playPauseButton.remove();
        this.recordButton.remove();
    }
}
