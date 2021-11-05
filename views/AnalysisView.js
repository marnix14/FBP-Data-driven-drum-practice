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
        textAlign(CENTER, TOP);
        text("AMAZING, here is your analysis:", width / 2, 40);

        this.drawWrappedHitGraph();
    }

    drawWrappedHitGraph() {
        for (const timedHit of this.exerciseSession.recording) {
            drawHit(timedHit);
        }
    }

    drawHit(hit) {}

    keyPressed() {}
}
