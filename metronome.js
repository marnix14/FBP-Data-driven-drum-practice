class Metronome {
    beatsPerMinute = 100;
    beatsPerBar = 4;

    isPlaying = false;
    prevBarPosition = 0;
    barPosition = 0;

    static soundNames = ["wood", "beep", "click"];
    static selectedSound = "wood";
    static sounds = {};

    static bufferedTickSound;

    static myArrayBuffer;

    static async preload() {
        for (const name of Metronome.soundNames) {
            Metronome.sounds[name] = [];
            Metronome.sounds[name][0] = new Sound(`/assets/sounds/metronome/tick_${name}.ogg`);
            Metronome.sounds[name][1] = new Sound(`/assets/sounds/metronome/tock_${name}.ogg`);
        }
    }

    constructor() {
        console.log("Metronome created");
    }

    eventCallbacks = [];

    addEventCallback(callback) {
        this.eventCallbacks.push(callback);
    }

    callEventCallbacks(event) {
        for (const callback of this.eventCallbacks) {
            callback(event);
        }
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
        this.callEventCallbacks("play");
    }

    pause() {
        this.isPlaying = false;
        this.callEventCallbacks("pause");
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
        this.callEventCallbacks("reset");
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

        if (switchedBeat) {
            this.callEventCallbacks("beat");
        }
        if (switchedBar) {
            this.tick();
        } else if (switchedBeat) {
            this.tock();
        }
    }

    tick() {
        this.playTickSound();
        this.callEventCallbacks("tick");
    }

    tock() {
        this.playTockSound();
        this.callEventCallbacks("tock");
    }

    setBarPosition(position) {
        this.barPosition = position;
    }

    playTickSound() {
        Metronome.sounds[Metronome.selectedSound][0].play(settings.metronomeVolume, 1, 0);
    }

    playTockSound() {
        Metronome.sounds[Metronome.selectedSound][1].play(settings.metronomeVolume, 1, 0);
    }

    isCountingDown(latency = 0) {
        return this.getBarPosition() < 0 && this.getBarPosition(latency) > -settings.recordingCountdownInBars;
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
