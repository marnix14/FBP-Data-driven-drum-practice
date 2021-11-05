class Metronome {
    beatsPerMinute = 100;
    beatsPerBar = 4;

    isPlaying = false;
    prevBarPosition = 0;
    barPosition = 0;

    static tickSound;

    static preload() {
        Metronome.tickSound = loadSound("assets/sounds/tick.wav");
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

    play(beatOffset = 0) {
        if (this.isPlaying) return;
        this.barPosition = this.barPosition + beatOffset / this.beatsPerBar;
        this.isPlaying = true;
    }

    pause() {
        this.isPlaying = false;
    }
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
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
            this.tick();
        } else if (switchedBeat) {
            this.tock();
        }
    }

    tick() {
        Metronome.tickSound.play(0, 1, Settings.getMetronomeVolume());
    }

    tock() {
        Metronome.tickSound.play(0, 0.8, Settings.getMetronomeVolume() * 0.8);
    }

    getWrappedBeatPosition(barPosition = this.barPosition) {
        const beatPosition = barPosition * this.beatsPerBar;
        return (beatPosition - floor(beatPosition)) % 1;
    }

    getWrappedBarPosition(barPosition = this.barPosition) {
        return (barPosition - floor(barPosition)) % 1;
    }

    getBeatPosition() {
        return this.barPosition * this.beatsPerBar;
    }
}
