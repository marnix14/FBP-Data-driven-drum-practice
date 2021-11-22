class Input {
    serial;
    portList;
    portName = "COM36";
    data;
    portSelector;


    constructor() { }

    preload() { }

    setup() {
        this.serial = new p5.SerialPort();
        this.serial.on("list", (ports) => console.log("Here be ports", ports));
        this.serial.list();
        this.serial.on("connected", () => console.log("connected to server."));
        this.serial.on("open", () => console.log("the serial port opened."));
        this.serial.on("data", this.serialEvent.bind(this)); // callback for when new data arrives
        this.serial.on("error", (err) => console.log("Something went wrong with the serial port. " + err));
        this.serial.on("close", () => console.log("The serial port closed."));
        this.serial.open(this.portName);
    }

    serialEvent() {
        this.data = Number(this.serial.read());
        //console.log("Received serial data:", this.data);
        let dext;
        let velocity;
        if (this.data < 128) {
            dext = "r";
            velocity = (this.data / 127);
        } else {
            dext = "l";
            velocity = ((this.data-127 )/ 127);

        }
        velocity = sqrt(velocity)
        console.log(dext, velocity.toFixed(2));
        //ExerciseSoundPlayer.playHit(velocity, 0);




        view.padInput(new Hit(dext, velocity));

    }


}
