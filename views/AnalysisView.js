class AnalysisView extends View {
    exerciseSession;
    good = color(0, 255, 0);
    middle = color(255, 255, 0);
    bad = color(255, 0, 0);
    velocityVisualized = true;
    showGrid = true;
    gridHeight = 120;

    constructor(exerciseSession) {
        super();
        this.exerciseSession = exerciseSession;
        this.exerciseSession.normalize();

        console.log("Viewing analysis of", this.exerciseSession);
    }

    update() {
        // TODO
    }

    draw() {
        textSize(50);
        fill(255);
        if (this.showGrid) {
            this.drawGrid();
        }
        stroke(0);
        strokeWeight(0);
        textAlign(LEFT, CENTER);
        fill(128);

        text("R", width * 0.1 - 120, height / 2 - 80);
        text("L", width * 0.1 - 120, height / 2 + 80);

        this.drawWrappedHitGraph();
    }

    drawGrid() {
        strokeWeight(4);
        stroke(40);
        line(width * 0.1, height / 2, width * 0.9, height / 2);
        const totalBeats = this.exerciseSession.exercise.bars * this.exerciseSession.exercise.beatsPerBar;
        const offset = this.gridHeight;
        for (let i = 0; i < totalBeats; i++) {
            const x = width * 0.1 + (i / totalBeats) * 0.8 * width;

            if (i % this.exerciseSession.exercise.beatsPerBar === 0) {
                strokeWeight(8);
                stroke(60);
                line(x, height / 2 + offset, x, height / 2 - offset);
            } else {
                strokeWeight(6);
                stroke(50);
                line(x, height / 2 + offset, x, height / 2 - offset);
            }
            for (let s = 1; s < this.exerciseSession.exercise.hitNotes[0].beatDivision; s++) {
                const beatDivisionOffset =
                    (1 / (totalBeats * this.exerciseSession.exercise.hitNotes[0].beatDivision)) * 0.8 * width;
                strokeWeight(4);
                stroke(40);
                line(x + beatDivisionOffset * s, height / 2 + offset, x + beatDivisionOffset * s, height / 2 - offset);
            }
        }
    }

    drawWrappedHitGraph() {
        for (const exerciseHit of this.exerciseSession.analysis) {
            for (const wrongHit of exerciseHit.wrongHits) {
                this.drawLinkedHit(exerciseHit, wrongHit, "rgba(255,0,0,0.3)", 10);
            }
            this.drawHit(
                exerciseHit.barPosition,
                exerciseHit.velocity,
                exerciseHit.getDexteritySign(),
                "rgba(65,65,65,1)",
                30
            );
            for (const recordedHit of exerciseHit.recordedHits) {
                let barOffset = getWrappedOffset(
                    exerciseHit.barPosition,
                    recordedHit.barPosition,
                    this.exerciseSession.exercise.bars
                );
                let color = this.getGradient(barOffset);
                color.setAlpha(150);
                this.drawLinkedHit(exerciseHit, recordedHit, color, 10);
            }

            this.drawMeanHit(exerciseHit);
        }
    }

    drawLinkedHit(exerciseHit, recordedHit, color, weight) {
        const barPosition =
            exerciseHit.barPosition +
            getWrappedOffset(exerciseHit.barPosition, recordedHit.barPosition, this.exerciseSession.exercise.bars);
        if (this.velocityVisualized) {
            this.drawHit(barPosition, recordedHit.velocity, recordedHit.getDexteritySign(), color, weight);
            //this.drawHitLine(barPosition, recordedHit.velocity, recordedHit.getDexteritySign(), color, weight);
        } else {
            this.drawHit(barPosition, exerciseHit.velocity, recordedHit.getDexteritySign(), color, weight);
        }
    }
    getGradient(barOffset) {
        let beatOffset = barOffset * this.exerciseSession.exercise.beatsPerBar;
        let offset = beatOffset * this.exerciseSession.exercise.hitNotes[0].beatDivision * 2;
        //console.log(offset);
        let color;
        if (abs(offset) < 0.2) {
            color = lerpColor(this.good, this.middle, pow(abs(offset), 1));
        } else {
            color = lerpColor(this.middle, this.bad, pow(abs(offset), 1));
        }
        color.setAlpha(200);
        return color;
    }
    drawMeanHit(exerciseHit) {
        let color = this.getGradient(exerciseHit.relativePositionMean);
        if (this.velocityVisualized) {
            this.drawHit(
                exerciseHit.barPosition + exerciseHit.relativePositionMean,
                exerciseHit.velocityMean,
                exerciseHit.getDexteritySign(),
                color,
                20
            );
        } else {
            this.drawHit(
                exerciseHit.barPosition + exerciseHit.relativePositionMean,
                exerciseHit.velocity,
                exerciseHit.getDexteritySign(),
                color,
                10
            );
        }
        //this.drawHitLine(exerciseHit.barPosition + exerciseHit.relativePositionMean, exerciseHit.velocityMean, exerciseHit.getDexteritySign(), color, 20);
    }
    drawHit(barPosition, velocity, dexteritySign, color, radius = 2) {
        const x = (barPosition / this.exerciseSession.exercise.bars) * width * 0.8;
        const y = dexteritySign * velocity * this.gridHeight;
        fill(color);
        circle(width * 0.1 + x, height / 2 - y, radius);
    }
    drawHitLine(barPosition, velocity, dexteritySign, color, weight = 2) {
        const x = (barPosition / this.exerciseSession.exercise.bars) * width * 0.8;
        const y = dexteritySign * velocity * this.gridHeight;
        stroke(color);
        strokeWeight(2);
        line(width * 0.1 + x, height / 2, width * 0.1 + x, height / 2 - y);
    }

    keyPressed() {}

    mouseDragged(dX, dY) {}
}
