class MidiView extends View {
    hand = "right";
    listeners = [];

    constructor() {
        super();
        this.initialize();
    }
    draw() {
        textAlign(CENTER);
        textSize(50);
        fill(255);
        noStroke();
        if (this.hand !== "done") {
            text("strike the " + this.hand + " pad", width / 2, height / 2);
        } else {
            text("input definition done!", width / 2, height / 2);
            textSize(20);
            text("Right input: " + settings.rightMidiNumber, width / 2 - 100, height / 2 + 50);
            text("Left input: " + settings.leftMidiNumber, width / 2 + 100, height / 2 + 50);
            text("Midi device: " + settings.inputDevice, width / 2, height / 2 + 100);
        }
    }
    update() {

    }

    initialize() {
        WebMidi.enable((err) => { //check if WebMidi.js is enabled
            if (err) {
                console.log("WebMidi could not be enabled.", err);
            } else {
                console.log("WebMidi enabled!");
            }
            //name our visible MIDI input and output ports
            for (let i = 0; i < WebMidi.inputs.length; i++) {
                console.log(i + ": " + WebMidi.inputs[i].name);
                this.listeners.push(WebMidi.inputs[i].addListener("midimessage",
                    (e) => {
                        if (e.message.type !== 'noteon') return;
                        if (this.hand == "right") {
                            settings.rightMidiNumber = e.message.data[1];
                            settings.inputDevice = WebMidi.inputs[i].name;
                            settings.inputChannel = e.message.channel;
                            this.hand = "left";

                        } else if (this.hand == "left") {
                            settings.leftMidiNumber = e.message.data[1];
                            this.hand = "done";
                            settings.store();
                            resetInput();
                            this.destroyListeners();


                        }
                    }
                )
                )
            }
        });
    }
    destroyListeners() {
        this.listeners.forEach((listener) => {
            console.log(listener);
            listener.remove();
        })
    }
}
