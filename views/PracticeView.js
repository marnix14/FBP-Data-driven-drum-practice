class PracticeView extends ExerciseBasedView {
    drumScroll = new DrumScroll();

    constructor() {
        super();
    }

    setup() {
        this.playButton = createButton("play");
        this.playButton.mousePressed(() => {
            this.drumScroll.play(0);
        });
        this.pauseButton = createButton("pause");
        this.pauseButton.mousePressed(() => {
            this.drumScroll.pause();
        });
        this.resetButton = createButton("reset");
        this.resetButton.mousePressed(() => {
            this.drumScroll.reset();
        });

        this.tempoSlider = createSlider(60, 1000, 174);
        this.tempoSlider.class("slider");
        this.tempoSlider.input(() => this.drumScroll.setBeatsPerMinute(this.tempoSlider.value()));
    }

    update() {
        // TODO
        this.drumScroll.update();
    }

    draw() {
        this.drumScroll.draw();
    }
}
