class Metronome {
    tick;
    nextTick = 0;
    currentBeat;
    beatsPerBar = 4;
    playing = false;
    bpm = 100;
    startMillis;

    constructor() {
        console.log('metronome created');

    }

    preLoadSound() {
        this.tick = loadSound('assets/tick.wav');
        this.tick.playMode('restart');
    }

    update() {
        if (this.playing) {

            let nextBeat = int(this.getOffset() * this.beatsPerBar);
            if (nextBeat !== this.currentBeat) {
                if (nextBeat == 0) {
                    this.tick.play(0, 1);
                } else {

                    this.tick.play(0, 0.8);
                }
                this.currentBeat = nextBeat;
                console.log(this.currentBeat);
            }
            noStroke();
            fill(255);
            text(this.currentBeat+1,width/2-200,height/2);
        }
    }
    getOffset() {
        let offset;
        if (this.playing) {
            let beatMillis = 60000 / this.bpm;
            let barMillis = beatMillis * this.beatsPerBar;
            let offsetMillis = millis() - this.startMillis;
            offset = offsetMillis % barMillis / barMillis;
        }
        else {
            offset = 0;
        }
        return offset;
    }
    setTempo(tempo) {
        this.bpm = tempo;
    }

    togglePlaying() {
        if (this.playing == true) {
            this.playing = false;
            this.currentBeat = 0;
        }
        else {
            this.playing = true;
            this.startMillis = millis();
        }
        console.log("playing " + this.playing);
    }

}