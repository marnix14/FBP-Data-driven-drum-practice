class DrumScroll extends Bounds {
    metronome = new Metronome();
    exerciseSession;

    maxRepeats = 8;
    currentRepeat = 0;

    // ratio to width (this.w) of bounding box
    currentTimeRuleWidthRatio = 0.5;
    barRuleWidthRatio = 0.4;
    beatRuleWidthRatio = 0.3;
    subdivisionRuleWidthRatio = 0.2;

    dexterityWidthRatio = 0.2;
    noteSizeRatio = 0.1;

    recordingCountdownInBars = 1;

    constructor(exerciseSession) {
        super();
        this.setExerciseSession(exerciseSession);
        console.log("DrumScroll created with Exercise Session", exerciseSession);
    }

    eventCallbacks = [];

    addEventCallback(callback) {
        this.eventCallbacks.push(callback);
    }

    callEventCallbacks(event) {
        for (const callback of this.eventCallbacks) {
            callback(event);
        }
    }

    setExerciseSession(exerciseSession) {
        this.exerciseSession = exerciseSession;
        this.metronome.beatsPerBar = this.exerciseSession.exercise.beatsPerBar;
    }

    play(beatOffset) {
        this.metronome.play(beatOffset);
        this.callEventCallbacks("play");
    }

    pause() {
        if (this.exerciseSession.isRecording) return;
        this.metronome.pause();
        this.callEventCallbacks("pause");
    }

    togglePlay() {
        if (this.metronome.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    reset() {
        if (this.exerciseSession.isRecording) return;
        this.metronome.reset();
        this.callEventCallbacks("reset");
    }

    stop() {
        if (this.exerciseSession.isRecording) {
            this.exerciseSession.stopRecording();
            this.callEventCallbacks("stoppedRecording");
        }
        this.pause();
        this.reset();
    }

    startRecording() {
        if (this.exerciseSession.isRecording) return;
        this.stop();
        const timestamp = Date.now();
        this.exerciseSession.startRecording(timestamp, this.metronome.beatsPerMinute);
        this.play(-this.recordingCountdownInBars * this.metronome.beatsPerBar);
    }

    update() {
        this.metronome.update();

        this.currentRepeat = this.metronome.barPosition / this.exerciseSession.exercise.bars;
        if (this.currentRepeat >= this.maxRepeats) this.stop();
        //this.metronome.setBeatsPerMinute(60 + int(5 * this.currentRepeat));
    }

    draw() {
        strokeWeight(0);
        fill(255);
        textSize(20);
        text(this.metronome.beatsPerMinute, 20, 70);
        textSize(20);
        text(`Repeats: ${int(this.currentRepeat)}`, 20, 100);
        this.drawExercise();
    }

    drawExercise() {
        const subdivisions = 3;
        this.drawMovingRules(subdivisions);

        const currentTimeRuleWidth = this.width * this.currentTimeRuleWidthRatio;
        this.drawRule(this.bottom, currentTimeRuleWidth, 150, 6);
        for (let r = max(0, int(this.currentRepeat) - 1); r < min(int(this.currentRepeat) + 2, this.maxRepeats); r++) {
            for (const hitNote of this.exerciseSession.exercise.hitNotes) {
                const globalNoteBarPosition = hitNote.barPosition + r * this.exerciseSession.exercise.bars;
                this.drawHitNote(hitNote, globalNoteBarPosition);
            }
        }

        if (this.metronome.barPosition < 0) {
            this.drawCountDown();
        }
    }

    drawSubdivisions(yNorm, amount) {
        for (let i = 0; i < amount; i++) {
            const yNormSub = yNorm + i / amount / this.metronome.beatsPerBar;
            if (yNormSub > 1) break;
            const color = 22 + yNormSub * 50;
            const subdivisionRuleWidth = this.subdivisionRuleWidthRatio * this.width;
            this.drawRule(this.y + yNormSub * this.height, subdivisionRuleWidth, color, 1);
        }
    }

    drawBeat(yNorm) {
        const beatRuleWidth = this.beatRuleWidthRatio * this.width;
        const beatRuleColor = 22 + yNorm * 70;
        this.drawRule(this.y + yNorm * this.height, beatRuleWidth, beatRuleColor, 3);
    }

    drawBar(yNorm) {
        const barRuleWidth = this.barRuleWidthRatio * this.width;
        const barRuleColor = 22 + yNorm * 90;
        this.drawRule(this.y + yNorm * this.height, barRuleWidth, barRuleColor, 6);
    }

    drawMovingRules(subdivisions = 2) {
        // calculate on the level of beats
        for (let i = 0; i < this.metronome.beatsPerBar; i++) {
            const yNorm = (i + this.metronome.getWrappedBeatPosition()) / this.metronome.beatsPerBar;
            this.drawSubdivisions(yNorm, subdivisions);
            this.drawBeat(yNorm);
            if (yNorm == this.metronome.getWrappedBarPosition()) {
                this.drawBar(yNorm);
            }
        }
    }

    drawRule(y, w, color = 255, thickness = 2) {
        stroke(color);
        strokeWeight(thickness);
        line(this.centerX - w / 2, y, this.centerX + w / 2, y);
    }

    drawHitNote(hitNote, globalBarPosition) {
        let y = this.y + this.h * (this.metronome.barPosition + 1 - globalBarPosition);
        const maxSize = this.noteSizeRatio * this.w;
        let size = sqrt(hitNote.velocity) * maxSize;
        if (y < -size || y > height + size) return;

        const dexterityWidth = this.dexterityWidthRatio * this.w;
        let xOffset = hitNote.isLeftHand() ? -dexterityWidth / 2 : dexterityWidth / 2;
        const notePassed = this.metronome.barPosition > globalBarPosition;
        const distanceFromMetronomeInBars = abs(this.metronome.barPosition - globalBarPosition);
        if (!notePassed) {
            const fade = 1 - min(1, distanceFromMetronomeInBars);
            fill(22 + hitNote.velocity * fade * 233);
        } else {
            const fade = 1 - min(1, distanceFromMetronomeInBars * 8);
            size *= fade * 1.5;
            fill(22 + hitNote.velocity * fade * 233);
        }
        strokeWeight(0);
        circle(this.centerX + xOffset, y, size);
        return true;
    }

    drawCountDown() {
        strokeWeight(0);
        fill(255, pow(min(1, abs(this.metronome.getBeatPosition() / 2)), 2) * 255);
        textSize(100);
        text(abs(floor(this.metronome.getBeatPosition())), this.centerX - 25, this.bottom + 100);
    }

    // value between 0 (start) and 1 (exercise done)
    getExercisePosition() {
        return (this.metronome.barPosition / this.exerciseSession.exercise.bars) % 1;
    }
}
