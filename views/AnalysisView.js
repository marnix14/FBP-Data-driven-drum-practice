class AnalysisView extends View {
    exerciseSession;

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
            this.drawHit(exerciseHit.barPosition, exerciseHit.velocity, exerciseHit.getDexteritySign(), "white", 5);

            for (const recordedHit of exerciseHit.recordedHits) {
                this.drawLinkedHit(exerciseHit, recordedHit, "rgba(0,255,0,0.3)", 3);
            }
            for (const wrongHit of exerciseHit.wrongHits) {
                this.drawLinkedHit(exerciseHit, wrongHit, "rgba(255,0,0,0.3)", 3);
            }
        }
    }

    drawLinkedHit(exerciseHit, recordedHit, color, weight) {
        const barPosition =
            exerciseHit.barPosition +
            getWrappedOffset(exerciseHit.barPosition, recordedHit.barPosition, this.exerciseSession.exercise.bars);
        this.drawHit(barPosition, recordedHit.velocity, recordedHit.getDexteritySign(), color, weight);
    }

    drawHit(barPosition, velocity, dexteritySign, color, weight = 2) {
        const x = (barPosition / this.exerciseSession.exercise.bars) * width * 0.8;
        const y = dexteritySign * velocity * 200;
        strokeWeight(weight);
        stroke(color);
        line(width * 0.1 + x, height / 2, width * 0.1 + x, height / 2 - y);
    }

    keyPressed() {}
}
