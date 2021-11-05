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
            this.drawHit(timedHit);
        }
    }

    drawHit(hit) {
        const x = (hit.barPosition % 1) * width * 0.8;
        const y = hit.velocity * 200;
        strokeWeight(2);
        stroke(255, 50);
        line(width * 0.1 + x, height / 2, width * 0.1 + x, height / 2 - y);
    }

    keyPressed() {}
}
