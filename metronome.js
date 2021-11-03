class Metronome {
    beatsPerMinute = 400;
    beatsPerBar = 3;

    isPlaying = false;
    prevBarPosition = 0;
    barPosition = 0;

    static tickSound;

    static preload() {
        Metronome.tickSound = loadSound("assets/tick.wav");
        Metronome.tickSound.playMode("restart");
    }

    constructor() {
        console.log("Metronome created");
    }

    update() {
        if (this.isPlaying) {
            const barsPerSecond = this.beatsPerMinute / 60 / this.beatsPerBar;
            const deltaTimeInSeconds = deltaTime / 1000;
            const deltaBarPosition = barsPerSecond * deltaTimeInSeconds;

            this.checkForTick(() => {
                this.barPosition += deltaBarPosition;
            });
        }
    }

    setBeatsPerMinute(beatsPerMinute) {
        this.beatsPerMinute = beatsPerMinute;
    }

    play() {
        this.isPlaying = true;
    }

    play(beatOffset) {
        this.barPosition = (this.barPosition + (this.beatsPerBar + beatOffset) / this.beatsPerBar) % 1;
        this.isPlaying = true;
    }

    pause() {
        this.isPlaying = false;
    }

    reset() {
        this.barPosition = 0;
        this.prevBarPosition = 0;
    }

    checkForTick(updateBarPosition) {
        this.prevBarPosition = this.getWrappedBarPosition(this.barPosition);
        const prevBeatPosition = this.getWrappedBeatPosition(this.prevBarPosition);

        updateBarPosition();

        const switchedBar =
            (this.prevBarPosition % 1 == 0 && this.prevBarPosition < this.getWrappedBarPosition()) ||
            this.prevBarPosition > this.getWrappedBarPosition();
        const switchedBeat =
            (prevBeatPosition % 1 == 0 && prevBeatPosition < this.getWrappedBeatPosition()) ||
            prevBeatPosition > this.getWrappedBeatPosition();

        if (switchedBar) {
            this.tick(1, 1);
        } else if (switchedBeat) {
            this.tick(0.8, 0.8);
        }
    }

    tick(rate, amp) {
        Metronome.tickSound.play(0, rate, amp);
    }

    getWrappedBeatPosition(barPosition = this.barPosition) {
        return (barPosition * this.beatsPerBar) % 1;
    }

    getWrappedBarPosition(barPosition = this.barPosition) {
        return barPosition % 1;
    }
}