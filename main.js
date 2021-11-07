view = null;
// TODO: save and load exercise history;
exerciseHistory = new ExerciseSessionHistory();

const transitionTimeMs = 200;
window.audioCTX = new (AudioContext || webkitAudioContext)({ latencyHint: 0 });

function preload() {
    loadData();
    Metronome.preload();
    ExerciseSessionHistory.preload();
    ExerciseSoundPlayer.preload();
}

function setup() {
    console.log("Setting up...");
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("sketch");
    this.overlay = select(".overlay");
    hideOverlay(1000);
    frameRate(240);
    textFont("Roboto");
    view = new ExerciseView(Exercises.exercises[0], 8);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    update();
    background(22);
    view.draw();
}

function update() {
    view.update();
}

function changeView(newView) {
    showOverlay(transitionTimeMs).then(() => {
        this.view.destroy();
        this.view = newView;
        hideOverlay(transitionTimeMs);
    });
}

function loadData() {
    loadJSON("assets/data/rudiments.json", (jsonFile) => {
        Rudiments.loadJSON(jsonFile);
        loadJSON("assets/data/exercises.json", (jsonFile) => {
            Exercises.loadJSON(jsonFile);
        });
    });
}

function keyPressed() {
    switch (keyCode) {
        case 66:
            //Metronome.tickSound.play(0, 1.2, 1);
            ExerciseSoundPlayer.padSounds["default"][2][0].play();
            break;

        case LEFT_ARROW:
            view.padInput(new Hit("l", 0.75));
            break;
        case RIGHT_ARROW:
            view.padInput(new Hit("r", 0.75));
            break;
        case 65: // a
            changeView(new AnalysisView(ExerciseSessionHistory.testExerciseSession));
            break;
        case 80: // p
            changeView(new ProgressView());
            break;
        case 69: // e
            changeView(new ExerciseView(Exercises.exercises[0]));

            break;
    }
    view.keyPressed();
}

async function showOverlay(ms) {
    this.overlay.style("transition", `opacity ${ms}ms`);
    select(".overlay").removeClass("hide");
    this.overlay.style("opacity", 1);
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function hideOverlay(ms) {
    this.overlay.style("transition", `opacity ${ms}ms`);
    this.overlay.style("opacity", 0);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            select(".overlay").addClass("hide");
            resolve();
        }, ms);
    });
}
