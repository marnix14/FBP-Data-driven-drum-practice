view = new PracticeView();
let rudiments;
function preload() {
    Metronome.preload();
    loadRudiments();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(240);
    view.setup();
}

function draw() {
    update();
    background(50);
    view.draw();
}

function update() {
    view.update();
}

function loadRudiments() {
    loadJSON("assets/rudiments.json", (jsonFile) => {
        rudiments = jsonFile;
        view.setExercise(Exercise.fromRudimentJSON(rudiments.Paradiddle[0]));
    });
}
