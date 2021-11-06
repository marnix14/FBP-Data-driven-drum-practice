class Sound {
    buffer;

    constructor(file) {
        const request = new XMLHttpRequest();
        console.log("Openening", file);

        request.open("GET", file, true);
        request.responseType = "arraybuffer";

        request.onload = () => {
            window.audioCTX.decodeAudioData(request.response, (decodedBuffer) => {
                this.buffer = decodedBuffer;
                console.log("Decoded", file);
            });
        };
        request.send().then(() => {
            console.log("Sent", file);
        });
    }

    play(volume = 1, rate = 1, pan = 0) {
        if (!this.buffer) throw Error("Tried to play an audio file which wasn't loaded");
        const panner = new StereoPannerNode(window.audioCTX, { pan: pan });
        const gainNode = window.audioCTX.createGain();
        gainNode.gain.value = volume;
        const bufferedSound = window.audioCTX.createBufferSource();
        bufferedSound.buffer = this.buffer;
        bufferedSound.playbackRate.value = rate;
        //bufferedSound.connect(gainNode).connect(panner).connect(window.audioCTX.destination);
        bufferedSound.connect(gainNode);
        gainNode.connect(panner);
        panner.connect(window.audioCTX.destination);
        bufferedSound.start(0);
    }
}
