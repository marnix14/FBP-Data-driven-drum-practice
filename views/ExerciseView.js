class ExerciseView extends View {
    drumScroll;
    metronome;
    exercise;
    exerciseSession;
    exerciseSoundPlayer;

    currentRepeat = 0;

    constructor(exercise = Exercise.EMPTY, repeats) {
        super();
        this.setExercise(exercise, repeats);
        this.initUI();
    }

    setExercise(exercise, repeats = 0) {
        this.exercise = exercise;
        this.exerciseSession = new ExerciseSession(exercise, repeats);
        this.metronome = new Metronome();
        this.drumScroll = new DrumScroll(this.exerciseSession, this.metronome);
        this.drumScroll.setSubDivisions(this.exercise.hitNotes[0].beatDivision);
        this.exerciseSoundPlayer = new ExerciseSoundPlayer(this.exercise, this.metronome);
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
                this.metronome.reset();
            },
        });

        this.playPauseButton = new ToggleButton({
            x: this.drumScroll.centerX - this.drumScroll.width / 2 - 10,
            y: this.drumScroll.bottom - 20,
            iconOn: "pause",
            iconOff: "play",
            clickedOn: () => {
                this.metronome.play();
            },
            clickedOff: () => {
                this.metronome.pause();
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
                this.startRecording();
            },
            clickedOff: () => {
                this.stopRecording();
            },
        });

        this.tempoSlider = new Slider({
            x: 80,
            y: 50,
            min: 30,
            max: 250,
            val: 100,
            step: 1,
            size: 200,
            input: (val) => {
                this.metronome.setBeatsPerMinute(val);
            },
        });

        this.exerciseSoundButton = new ToggleButton({
            x: this.drumScroll.centerX - 20,
            y: height - 70,
            iconOn: "snare",
            iconOff: "snare_mute",
            size: 47,
            clickedOn: () => {
                this.exerciseSoundPlayer.unmute();
            },
            clickedOff: () => {
                this.exerciseSoundPlayer.mute();
            },
        });

        this.focusSlider = new Slider({
            x: this.drumScroll.centerX - this.drumScroll.width / 4,
            y: height - 100,
            min: -1,
            max: 1,
            val: 0,
            step: 0,
            size: this.drumScroll.width / 2,
            input: (val) => {
                this.exerciseSoundPlayer.setFocus(val);
            },
        });

        this.metronome.addEventCallback((event) => {
            //console.log("Metronome event: ", event);
            this.updateButtons();
        });
    }

    startRecording() {
        if (this.exerciseSession.isRecording) return;
        this.metronome.pause();
        this.metronome.reset();
        const timestamp = Date.now();
        this.exerciseSession.startRecording(timestamp, this.metronome.beatsPerMinute);
        this.metronome.play(-Settings.recordingCountdownInBars * this.metronome.beatsPerBar);
    }

    stopRecording() {
        this.exerciseSession.stopRecording();
        if (this.exerciseSession.recording.length > 0) {
            changeView(new AnalysisView(this.exerciseSession));
        } else {
            this.metronome.pause();
            this.metronome.reset();
        }
    }

    updateButtons() {
        if (this.exerciseSession.hasRecorded()) return;
        if (this.metronome.isPlaying) {
            this.playPauseButton.setOn();
            this.resetButton.disable();
            if (this.exerciseSession.isRecording) {
                this.focusSlider.disable();
                this.exerciseSoundButton.disable();
                this.exerciseSoundButton.setOff();
                this.playPauseButton.disable();
            } else {
                this.focusSlider.enable();
                this.exerciseSoundButton.enable();
                this.playPauseButton.enable();
            }
        } else {
            this.focusSlider.enable();
            this.exerciseSoundButton.enable();

            this.playPauseButton.enable();
            this.playPauseButton.setOff();
            if (this.metronome.getBarPosition() > 0) {
                this.resetButton.enable();
            } else {
                this.resetButton.disable();
            }
        }
    }

    update() {
        this.metronome.update();
        this.drumScroll.update();
        this.exerciseSoundPlayer.update();

        this.currentRepeat = this.metronome.getBarPosition(Settings.audioLatency) / this.exerciseSession.exercise.bars;
        if (this.currentRepeat >= this.exerciseSession.repeats) {
            this.metronome.pause();
            this.metronome.reset();
            changeView(new AnalysisView(this.exerciseSession));
        }
    }

    draw() {
        strokeWeight(0);
        fill(255);
        textSize(20);
        text(this.metronome.beatsPerMinute, 20, 70);
        textSize(20);
        text(`Repeats: ${int(this.currentRepeat)}`, 20, 100);
        this.drumScroll.draw();
        if (this.metronome.isCountingDown(Settings.audioLatency)) {
            this.drawCountDown();
        }
    }

    drawCountDown() {
        strokeWeight(0);
        fill(255, pow(min(1, abs(this.metronome.getBeatPosition() / 2)), 2) * 255);
        textSize(100);
        text(
            abs(floor(this.metronome.getBeatPosition(Settings.audioLatency))),
            this.drumScroll.centerX - 25,
            this.drumScroll.bottom + 100
        );
    }

    keyPressed() {
        switch (keyCode) {
            case 32: // spacebar
                this.playPauseButton.toggle();
                break;
            case 36: // home
            case ESCAPE:
            case BACKSPACE:
                this.resetButton.clicked();
                break;
            case ENTER:
                this.recordButton.toggle();
                break;
        }
    }

    padInput(hit) {
        this.exerciseSession.padInput(TimedHit.fromHitAndMetronome(hit, this.metronome));
    }

    getAnalysisView() {
        return new AnalysisView(this.exerciseSession);
    }

    // value between 0 (start) and 1 (exercise done)
    getExercisePosition() {
        return (this.metronome.getBarPosition(Settings.audioLatency) / this.exerciseSession.exercise.bars) % 1;
    }

    destroy() {
        this.tempoSlider.remove();
        this.resetButton.remove();
        this.playPauseButton.remove();
        this.recordButton.remove();
        this.focusSlider.remove();
        this.exerciseSoundButton.remove();
    }
}
