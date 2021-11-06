class Settings {
    static audioVolume = 0.7;
    static metronomeVolume = 0.7;

    static audioLatency = 175;

    static getMetronomeVolume() {
        return this.audioVolume * this.metronomeVolume;
    }
}
