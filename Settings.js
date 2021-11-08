class Settings {
    static audioVolume = 1;
    static metronomeVolume = 1;
    static hitVolume = 1;

    static audioLatency = 22;

    static recordingCountdownInBars = 1;

    static getMetronomeVolume() {
        return this.audioVolume * this.metronomeVolume;
    }
}
