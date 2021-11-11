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
    this.sliderText();
    
}
function sliderText(){
    noStroke();
    textSize(16);
    fill(255);
    //text("shape",20,200);
    text("opacity",width/2-450,300);
    text("spacing",width/2-450,330);
    text("size",width/2-450,360);
    text("strokeweight",width/2-450,390);
}

function UIelements() {
    tempoSlider = createSlider(40, 250, 100);
    tempoSlider.class('slider');
    tempoSlider.position(10, 500);
    tempoSlider.input(() => metronome.setTempo(tempoSlider.value()));

    shapePicker = createSelect()
    shapePicker.position(width/2-450, 260);
    shapePicker.option('circle');
    shapePicker.option('line');
    shapePicker.option('triangle');
    shapePicker.selected('circle');
    shapePicker.changed(() => visualization.setShape(shapePicker.value()));

    opacitySlider = createSlider(20, 255, 180);
    opacitySlider.class('slider');
    opacitySlider.position(width/2-450, 300);
    opacitySlider.input(() => visualization.setOpacity(opacitySlider.value()));

    spacingSlider = createSlider(0, 200, 100, 0);
    spacingSlider.class('slider');
    spacingSlider.position(width/2-450, 330);
    spacingSlider.input(() => visualization.setSpacing(spacingSlider.value()));

    sizeSlider = createSlider(0, 1, 0.5, 0);
    sizeSlider.class('slider');
    sizeSlider.position(width/2-450, 360);
    sizeSlider.input(() => visualization.setSize(sizeSlider.value()));

    strokeWeightSlider = createSlider(3, 25, 3);
    strokeWeightSlider.class('slider');
    strokeWeightSlider.position(width/2-450, 390);
    strokeWeightSlider.input(() => visualization.setStrokeWeight(strokeWeightSlider.value()));

    playButton = createButton("play");
    playButton.position(10, 520);
    playButton.mousePressed(() => {
        metronome.togglePlaying();
        playButton.html(metronome.playing ? "stop" : "play");
    });

}