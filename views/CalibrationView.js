class CalibrationView extends View {
    calibrationState = "input";

    metronome = new Metronome();

    static repeats = 8;
    static takeLastHitsAmount = 5;

    inputLatencies = [];
    inputLatency = 0;
    audioLatencies = [];
    audioLatency = 0;

    skipButton;
    saveButton;

    constructor() {
        super();

        settings.metronomeVolume = 0;
        this.metronome.beatsPerMinute = 80;
        this.metronome.play();

        this.inputLatency = settings.inputLatency;
        this.audioLatency = settings.audioLatency;

        this.skipButton = new IconButton({
            x: width / 2 - 20,
            y: height - 200,
            size: 40,
            text: "skip",
            clicked: () => this.skip(),
        });
    }

    skip() {
        switch (this.calibrationState) {
            case "input":
                this.startAudioCalibration();
                break;
            case "audio":
                this.endCalibration();
                break;
        }
    }

    draw() {
        textSize(50);
        fill(255);
        stroke(0);
        strokeWeight(0);
        textAlign(CENTER, TOP);
        text("Calibration", width / 2, 40);
        if (this.calibrationState === "input") {
            textSize(25);
            text("Input calibration:", width / 2, 190);
            textSize(18);
            text("At the moment the ball hits the ground, strike the pad.", width / 2, 225);
            text(`The calibration will take ${CalibrationView.repeats} strikes.`, width / 2, 250);
            this.drawBall();
        }
        if (this.calibrationState === "audio") {
            textSize(25);
            text("Audio calibration:", width / 2, 190);
            textSize(18);
            text("You should hear a metronome alternating two pitches.", width / 2, 225);
            text("At the moment the higher pitched sound plays, strike the pad.", width / 2, 250);
            text(`The calibration will take ${CalibrationView.repeats} strikes.`, width / 2, 275);
        }
        if (this.calibrationState === "done") {
            textSize(25);
            text("Completed!", width / 2, 190);
            text("Intput latency:", width / 2 - 100, 250);
            text("Audio latency:", width / 2 + 100, 250);
            text(`${this.inputLatency} ms`, width / 2 - 100, 300);
            text(`${this.audioLatency} ms`, width / 2 + 100, 300);
        }
    }

    drawBall() {
        let y = this.metronome.getWrappedBeatPosition();
        y = pow(y * 2 - 1, 2);
        strokeWeight(0);
        circle(width / 2, height / 2 + y * 200, 50);
        strokeWeight(3);
        stroke(255);
        line(width / 2 - 100, height / 2 + 225, width / 2 + 100, height / 2 + 225);
    }
    update() {
        this.metronome.update();
    }

    padInput(hit) {
        const beatOffset = getWrappedOffset(0, this.metronome.getWrappedBeatPosition(), 1);
        const msOffset = (beatOffset / this.metronome.beatsPerMinute) * 60 * 1000;
        this.calculateLatency(msOffset);
    }

    calculateLatency(msOffset) {
        if (this.calibrationState == "input") {
            this.inputLatencies.push(msOffset);
            if (this.inputLatencies.length >= CalibrationView.repeats) {
                this.inputLatency = this.getLatencyFromInputLatencies(this.inputLatencies);
                this.startAudioCalibration();
            }
        } else if (this.calibrationState == "audio") {
            this.audioLatencies.push(msOffset - this.inputLatency);
            if (this.audioLatencies.length > CalibrationView.repeats) {
                this.audioLatency = this.getLatencyFromInputLatencies(this.audioLatencies);
                this.endCalibration();
            }
        }
    }

    endCalibration() {
        this.skipButton.remove();
        this.metronome.pause();
        this.calibrationState = "done";
        this.saveButton = new IconButton({
            x: width / 2 - 20,
            y: 400,
            size: 40,
            text: "save",
            clicked: () => {
                settings.inputLatency = this.inputLatency;
                settings.audioLatency = this.audioLatency;
                settings.store();
                changeView(new ExerciseView(Exercises.exercises[0]));
            },
        });
    }

    startAudioCalibration() {
        this.calibrationState = "audio";
        this.metronome.beatsPerMinute = 80 * 2;
        this.metronome.beatsPerBar = 2;
        this.metronome.reset();
        settings.metronomeVolume = 1;
    }

    getLatencyFromInputLatencies(inputLatencies) {
        let latencySum = 0;
        let latencyWindowSize = 0;
        for (let i = inputLatencies.length - 1 - CalibrationView.takeLastHitsAmount; i < inputLatencies.length; i++) {
            latencySum += inputLatencies[i];
            latencyWindowSize++;
        }
        return int(max(0, latencySum / latencyWindowSize));
    }

    destroy() {
        this.saveButton.remove();
    }
}
