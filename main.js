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
    view.setup();
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
    loadJSON("assets/rudiments.json", (jsonFile) => {
        Rudiments.loadJSON(jsonFile);
        loadJSON("assets/exercises.json", (jsonFile) => {
            Exercises.loadJSON(jsonFile);
        });
    });
}
