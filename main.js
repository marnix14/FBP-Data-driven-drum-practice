let metronome = new Metronome();
let exercise = new Exercise('paradiddle', 'RlrrLrll', 1/2, 4);
let visualization = new Visualization(metronome, exercise);

function preload() {
    console.log('main');
    metronome.preLoadSound();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    UIelements();
    visualization.setup();
}

function draw() {
    background(50);
    metronome.update();
    visualization.display();
}

function UIelements() {
    tempoSlider = createSlider(40, 250, 100);
    tempoSlider.class('slider');
    tempoSlider.input(() => metronome.setTempo(tempoSlider.value()));
    playButton = createButton("play");
    playButton.mousePressed(() => {
        metronome.togglePlaying();
        playButton.html(metronome.playing ? "stop" : "play");
    });
   // let inp = createInput('');
    //inp.position(0,0);


}