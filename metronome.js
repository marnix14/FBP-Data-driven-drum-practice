class Metronome {
    beatsPerMinute = 100;
    beatsPerBar = 4;

    isPlaying = false;
    prevBarPosition = 0;
    barPosition = 0;

    static tickSound;

    static bufferedTickSound;

    static myArrayBuffer;

    static async preload() {
        Metronome.tickSound = new Sound("/assets/sounds/tick.mp3");
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
        this.prevBarPosition = this.barPosition;
        const prevWrappedBeatPosition = this.getWrappedBeatPositionOf(this.prevBarPosition);
        const prevWrappedBarPosition = this.getWrappedBarPositionOf(this.barPosition);

        updateBarPosition();

        const switchedBar =
            (prevWrappedBarPosition % 1 == 0 && prevWrappedBarPosition < this.getWrappedBarPosition()) ||
            prevWrappedBarPosition > this.getWrappedBarPosition();
        const switchedBeat =
            (prevWrappedBeatPosition % 1 == 0 && prevWrappedBeatPosition < this.getWrappedBeatPosition()) ||
            prevWrappedBeatPosition > this.getWrappedBeatPosition();

        if (switchedBar) {
            this.tick();
        } else if (switchedBeat) {
            this.tock();
        }
    }

    tick() {
        Metronome.tickSound.play(Settings.getMetronomeVolume(), 1, 0);
    }

    tock() {
        Metronome.tickSound.play(Settings.getMetronomeVolume() * 0.8, 0.8, 0);
    }

    getWrappedBeatPositionOf(barPosition = this.barPosition) {
        const beatPosition = barPosition * this.beatsPerBar;
        return (beatPosition - floor(beatPosition)) % 1;
    }

    getWrappedBarPositionOf(barPosition = this.barPosition) {
        return (barPosition - floor(barPosition)) % 1;
    }

    getWrappedBeatPosition(latency = 0) {
        const beatPosition = this.getBarPosition(latency) * this.beatsPerBar;
        return (beatPosition - floor(beatPosition)) % 1;
    }

    getWrappedBarPosition(latency = 0) {
        return (this.getBarPosition(latency) - floor(this.getBarPosition(latency))) % 1;
    }

    getBeatPosition(latency = 0) {
        return this.getBarPosition(latency) * this.beatsPerBar;
    }
    getBarPosition(latency = 0) {
        return this.barPosition - this.millisecondsToBars(latency);
    }
    getPreviousBarPosition(latency = 0) {
        return this.prevBarPosition - this.millisecondsToBars(latency);
    }

    millisecondsToBars(ms) {
        return ((ms / 1000 / 60) * this.beatsPerMinute) / this.beatsPerBar;
    }
}
