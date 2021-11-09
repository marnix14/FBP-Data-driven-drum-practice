class AnalysisView extends View {
    exerciseSession;

    exerciseHitAnalysis = [];

    constructor(exerciseSession) {
        super();
        this.exerciseSession = exerciseSession;
        console.log("Viewing analysis of", this.exerciseSession);

        for (const exerciseHit of this.exerciseSession.exercise.hitNotes) {
            this.exerciseHitAnalysis.push(new HitAnalysis(exerciseHit));
        }

        for (const recordedHit of this.exerciseSession.recording) {
            this.getClosestExerciseHit(recordedHit).addHit(recordedHit);
        }

        for (const exerciseHitAnalysis of this.exerciseHitAnalysis) {
            exerciseHitAnalysis.analyse(this.exerciseSession.exercise);
        }
        console.log("Analysed exercise hits: ", this.exerciseHitAnalysis);
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
        for (const exerciseHit of this.exerciseHitAnalysis) {
            this.drawHit(exerciseHit, "white", 5);

            for (const recordedHit of exerciseHit.recordedHits) {
                this.drawHit(recordedHit, "rgba(0,255,0,0.3)", 3);
            }
            for (const wrongHit of exerciseHit.wrongHits) {
                this.drawHit(wrongHit, "rgba(255,0,0,0.3)", 3);
            }
        }
    }

    drawHit(hit, color, weight = 2) {
        const x = ((hit.barPosition / this.exerciseSession.exercise.bars) % 1) * width * 0.8;
        const y = hit.getDexteritySign() * hit.velocity * 200;
        strokeWeight(weight);
        stroke(color);
        line(width * 0.1 + x, height / 2, width * 0.1 + x, height / 2 - y);
    }

    keyPressed() {}

    getClosestExerciseHit(recordedHit) {
        let closestExerciseHit = null;
        let closestExerciseHitDistance = Number.POSITIVE_INFINITY;
        for (const i in this.exerciseHitAnalysis) {
            const exerciseHit = this.exerciseHitAnalysis[i];
            const distance = abs(
                getWrappedOffset(recordedHit.barPosition, exerciseHit.barPosition, this.exerciseSession.exercise.bars)
            );

            if (distance < closestExerciseHitDistance) {
                closestExerciseHitDistance = distance;
                closestExerciseHit = exerciseHit;
            }
        }

        return closestExerciseHit;
    }
}
