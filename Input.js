class Input {
    serial;
    portList;
    portName = "COM36";
    data;
    portSelector;
    maxHitVelocity = 10;

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
        
        var inData = this.serial.readLine();
        //this.serial.serialBuffer.length =0;
        if (inData.length>0) {
            let splitString = split(inData, ' ');
            let dext = splitString[0];
            let velocity = Number(splitString[1]);
            view.padInput(new Hit(dext, velocity / this.maxHitVelocity));
            console.log("Serial data: " + inData);

        }
        //inData = null;


    }
}
