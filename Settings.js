class Settings {
    static audioVolume = 0.7;
    static metronomeVolume = 0.7;

    static getMetronomeVolume() {
        return this.audioVolume * this.metronomeVolume;
    }
}
