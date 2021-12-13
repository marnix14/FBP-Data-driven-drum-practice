class DrumScroll extends Bounds {
    metronome;
    exerciseSession;

    // ratio to width (this.w) of bounding box
    currentTimeRuleWidthRatio = 0.5;
    barRuleWidthRatio = 0.4;
    beatRuleWidthRatio = 0.3;
    subdivisionRuleWidthRatio = 0.2;

    dexterityWidthRatio = 0.25;
    noteSizeRatio = 0.1;

    subdivisions = 0;
    panning = 0;

    constructor(metronome) {
        super();
        this.metronome = metronome;
    }

    setSubDivisions(subdivisions) {
        this.subdivisions = subdivisions;
    }

    setExerciseSession(exerciseSession) {
        if (exerciseSession) {
            this.exerciseSession = exerciseSession;
            this.metronome.beatsPerBar = this.exerciseSession.exercise.beatsPerBar;
        } else {
            throw Error("Drumroll started without exercise");
        }
    }

    update() { }

    draw() {
        this.drawExercise();
    }

    drawExercise() {
        const currentRepeat = this.metronome.getBarPosition(settings.audioLatency) / this.exerciseSession.exercise.bars;
        this.drawMovingRules(this.subdivisions);
        const currentTimeRuleWidth = this.width * this.currentTimeRuleWidthRatio;
        this.drawRule(this.bottom, currentTimeRuleWidth, 150, 6);
        for (
            let r = max(0, int(currentRepeat) - 2);
            r < min(int(currentRepeat) + 3, this.exerciseSession.repeats);
            r++
        ) {
            for (const i in this.exerciseSession.exercise.hitNotes) {
                const hitNote = this.exerciseSession.exercise.hitNotes[i];
                const globalNoteBarPosition = hitNote.barPosition + r * this.exerciseSession.exercise.bars;
                this.drawHitNote(i, hitNote, globalNoteBarPosition);
            }

            let rudimentBarPosition = 0;
            for (const [abbr, subdivision, rudimentRepeats, switchHand] of this.exerciseSession.exercise.structure) {
                const rudiment = Rudiments.getByAbbr(abbr);
                const rudimentNoteCount = rudiment.pattern.length;
                const rudimentLengthInBeats = rudimentNoteCount / subdivision;
                const rudimentLengthInBars = rudimentLengthInBeats / this.exerciseSession.exercise.beatsPerBar;

                for (let rr = 0; rr < rudimentRepeats; rr++) {
                    this.drawRudimentLine(
                        rudimentBarPosition + r * this.exerciseSession.exercise.bars,
                        rudimentLengthInBars,
                        switchHand ? -1 : 1,
                        rudiment.color
                    );
                    rudimentBarPosition += rudimentLengthInBars;
                }
            }
        }
    }

    rudimentLineOffsetRatio = 0.6;
    drawRudimentLine(barPosition, lengthInBars, dexterity, rudimentColor) {
        strokeWeight(10);
        const yStartNormalized = min(1, this.metronome.getBarPosition(settings.audioLatency) + 1 - barPosition);
        const yEndNormalized =
            this.metronome.getBarPosition(settings.audioLatency) + 1 - (barPosition + lengthInBars) + 0.04;
        if (yEndNormalized >= yStartNormalized) return;

        const yStart = this.y + this.h * yStartNormalized;
        const yEnd = this.y + this.h * yEndNormalized;

        const x = this.centerX + (dexterity * this.rudimentLineOffsetRatio * this.w) / 2;

        const opacity = pow(yStartNormalized, 2);
        const c = color(rudimentColor);
        stroke(c.levels[0], c.levels[1], c.levels[2], opacity * 255);

        line(x, yStart, x, yEnd);
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
            const yNorm =
                (i + this.metronome.getWrappedBeatPosition(settings.audioLatency)) / this.metronome.beatsPerBar;
            this.drawSubdivisions(yNorm, subdivisions);
            this.drawBeat(yNorm);
        }
        this.drawBar(this.metronome.getWrappedBarPosition(settings.audioLatency));
    }

    drawRule(y, w, color = 255, thickness = 2) {
        stroke(color);
        strokeWeight(thickness);
        line(this.centerX - w / 2, y, this.centerX + w / 2, y);
    }
    setPanning(val) {
        this.panning = val;
    }

    drawHitNote(index, hitNote, globalBarPosition) {
        let y = this.y + this.h * (this.metronome.getBarPosition(settings.audioLatency) + 1 - globalBarPosition);
        const maxSize = this.noteSizeRatio * this.w;
        let size = sqrt(hitNote.velocity) * maxSize;
        if (y < -size || y > height + size) return;

        const dexterityWidth = this.dexterityWidthRatio * this.w;
        let xOffset = hitNote.isLeftHand() ? -dexterityWidth / 2 : dexterityWidth / 2;
        const notePassed = this.metronome.getBarPosition(settings.audioLatency) > globalBarPosition;
        const distanceFromMetronomeInBars = abs(
            this.metronome.getBarPosition(settings.audioLatency) - globalBarPosition
        );
        let alpha = hitNote.getDexteritySign() !== Math.sign(this.panning) ? 255 * (1 - abs(this.panning)) : 255;

        if (!notePassed) {
            const fade = 1 - min(1, distanceFromMetronomeInBars);
            fill(22 + hitNote.velocity * fade * 233, alpha);
        } else {
            const fade = 1 - min(1, distanceFromMetronomeInBars * 8);
            size *= fade * 1.5;
            fill(22 + hitNote.velocity * fade * 233, alpha);
        }

        strokeWeight(0);
        circle(this.centerX + xOffset, y, size);
        return true;
    }
}
