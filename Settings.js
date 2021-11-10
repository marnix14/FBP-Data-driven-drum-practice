class Settings {
    constructor() {}
    audioVolume = 1;
    metronomeVolume = 1;
    hitVolume = 1;

    inputLatency = 20;
    audioLatency = 80;

    recordingCountdownInBars = 1;

    maxErrorInBeats = 0.2;
    maxErrorInVelocity = 0.5;

    store() {
        console.log("Storing", this);
        window.localStorage.setItem("settings", JSON.stringify(this));
    }

    static load() {
        const settings = window.localStorage.getItem("settings");
        if (settings) {
            console.log("Loading stored settings:", JSON.parse(settings));
            return Object.assign(new Settings(), JSON.parse(settings));
        } else {
            return new Settings();
        }
    }
}
