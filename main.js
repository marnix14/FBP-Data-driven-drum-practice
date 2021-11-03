let metronome = new Metronome();
let exercise = new Exercise('paradiddle', 'RlrrLrll', 1 / 2, 4);
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
    tempoSlider.position(10,110);
    tempoSlider.input(() => metronome.setTempo(tempoSlider.value()));
    
shapePicker = createSelect()
    shapePicker.position(10,200);
    shapePicker.option('circle');
    shapePicker.option('line');
    shapePicker.option('triangle');
    shapePicker.selected('circle');
    shapePicker.changed(() => visualization.setShape(shapePicker.value()));


    opacitySlider = createSlider(20, 255, 180);
    opacitySlider.class('slider');
    opacitySlider.position(10,300);
    opacitySlider.input(() => visualization.setOpacity(opacitySlider.value()));

    spacingSlider = createSlider(0,200,100,0);
    spacingSlider.class('slider');
    spacingSlider.position(10,330);
    spacingSlider.input(() => visualization.setSpacing(spacingSlider.value()));

    strokeWeightSlider = createSlider(3,25,3);
    strokeWeightSlider.class('slider');
    strokeWeightSlider.position(10,360);
    strokeWeightSlider.input(() => visualization.setStrokeWeight(strokeWeightSlider.value()));

    playButton = createButton("play");
    playButton.position(40,140);
    playButton.mousePressed(() => {
        metronome.togglePlaying();
        playButton.html(metronome.playing ? "stop" : "play");
    });
    
}