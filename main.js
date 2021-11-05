view = new ExerciseView();

// TODO: save and load exercise history;
exerciseHistory = new ExerciseSessionHistory();

function preload() {
    loadData();
    Metronome.preload();
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("sketch");
    frameRate(240);
    textFont("Roboto");
    view.setup();
    view.setExercise(Exercises.exercises[0]);
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

function loadData() {
    loadJSON("assets/data/rudiments.json", (jsonFile) => {
        Rudiments.loadJSON(jsonFile);
        loadJSON("assets/data/exercises.json", (jsonFile) => {
            Exercises.loadJSON(jsonFile);
        });
    });
}

function keyPressed() {
    view.keyPressed();
}
