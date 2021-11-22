class AnalysisView extends View {
    exerciseSession;
    good = color(0, 255, 0);
    middle = color(255,255,0);
    bad = color(255, 0, 0);
    constructor(exerciseSession) {
        super();
        this.exerciseSession = exerciseSession;
        console.log("Viewing analysis of", this.exerciseSession);
    }

    update() {
        // TODO
    }

    draw() {
        textSize(50);
        fill(255);
        stroke(0);
        strokeWeight(0);
        textAlign(LEFT, TOP);
        text("Analysis", 40, 40);

        this.drawWrappedHitGraph();
    }

    drawWrappedHitGraph() {
        for (const exerciseHit of this.exerciseSession.analysis) {
            this.drawHit(exerciseHit.barPosition, exerciseHit.velocity, exerciseHit.getDexteritySign(), "rgba(255,255,255,0.6)", 5);
            this.drawMeanHit(exerciseHit);
            for (const recordedHit of exerciseHit.recordedHits) {
                let barOffset = getWrappedOffset(exerciseHit.barPosition, recordedHit.barPosition, this.exerciseSession.exercise.bars);
                let color = this.getGradient(barOffset)
                this.drawLinkedHit(exerciseHit, recordedHit, color, 3);
            }
            for (const wrongHit of exerciseHit.wrongHits) {
               // this.drawLinkedHit(exerciseHit, wrongHit, "rgba(255,0,0,0.3)", 3);
            }
        }
    }

    drawLinkedHit(exerciseHit, recordedHit, color, weight) {
        const barPosition =
            exerciseHit.barPosition +
            getWrappedOffset(exerciseHit.barPosition, recordedHit.barPosition, this.exerciseSession.exercise.bars);

        this.drawHit(barPosition, recordedHit.velocity, recordedHit.getDexteritySign(), color, weight);
    }
    getGradient(barOffset) {
        let beatOffset = barOffset * this.exerciseSession.exercise.beatsPerBar;
        let offset = beatOffset * this.exerciseSession.exercise.hitNotes[0].beatDivision * 2
        console.log(offset);
        let color;
        if (abs(offset) < 0.2) {
            color = lerpColor(this.good, this.middle, pow(abs(offset), 2 / 3));
        }
        else {
            color = lerpColor(this.middle, this.bad, pow(abs(offset), 2 / 3));
        }
        return color;

    }
    drawMeanHit(exerciseHit) {
        let color = this.getGradient(exerciseHit.relativePositionMean);
        this.drawHit(exerciseHit.barPosition + exerciseHit.relativePositionMean, exerciseHit.velocityMean, exerciseHit.getDexteritySign(), color, 5);

    }
    drawHit(barPosition, velocity, dexteritySign, color, weight = 2) {
        const x = (barPosition / this.exerciseSession.exercise.bars) * width * 0.8;
        const y = dexteritySign * velocity * 200;
        strokeWeight(weight);
        stroke(color);
        line(width * 0.1 + x, height / 2, width * 0.1 + x, height / 2 - y);
    }

    keyPressed() { }
}
