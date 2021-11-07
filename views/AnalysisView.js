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
        for (const timedHitNote of this.exerciseSession.exercise.hitNotes) {
            this.drawExerciseNote(timedHitNote);
        }

        for (const timedHit of this.exerciseSession.recording) {
            this.drawUserHit(timedHit);
        }
    }
    drawExerciseNote(note) {
        const x = ((note.barPosition / this.exerciseSession.exercise.bars) % 1) * width * 0.8;
        const y = note.getDexteritySign() * note.velocity * 200;
        strokeWeight(4);
        stroke(255, 0, 0);
        line(width * 0.1 + x, height / 2, width * 0.1 + x, height / 2 - y);
    }

    drawUserHit(hit) {
        const x = ((hit.barPosition / this.exerciseSession.exercise.bars) % 1) * width * 0.8;
        const y = hit.getDexteritySign() * hit.velocity * 200;
        strokeWeight(4);
        stroke(255, 50);
        line(width * 0.1 + x, height / 2, width * 0.1 + x, height / 2 - y);
    }

    keyPressed() {}
}
