class ToggleButton extends IconButton {
    isOn;
    iconOn;
    iconOff;
    clickedOn;
    clickedOff;

    constructor(options) {
        super(options);
        console.assert(!options.icon, "Please use iconOn and iconOff instead of icon");
        this.iconOn = options.iconOn;
        this.iconOff = options.iconOff;
        this.classOn = options.classOn;
        this.classOff = options.classOff;
        this.clickedOn = options.clickedOn;
        this.clickedOff = options.clickedOff;
        this.isOn = options.startOn ?? false;

        this.element.mousePressed(() => this.toggle());
        this.applyStateChange();
    }

    toggle() {
        if (this.isOn) {
            this.setOff();
        } else {
            this.setOn();
        }
    }

    applyStateChange() {
        if (this.isOn) {
            if (this.iconOn) {
                this.element.removeClass(this.iconOff + "_icon");
                if (!this.element.hasClass(this.iconOn + "_icon")) {
                    this.element.addClass(this.iconOn + "_icon");
                }
            }
            if (this.classOn) {
                this.element.removeClass(this.classOff);
                if (!this.element.hasClass(this.classOn)) {
                    this.element.addClass(this.classOn);
                }
            }
        } else {
            if (this.iconOff) {
                this.element.removeClass(this.iconOn + "_icon");
                if (!this.element.hasClass(this.iconOff + "_icon")) {
                    this.element.addClass(this.iconOff + "_icon");
                }
            }
            if (this.classOff) {
                this.element.removeClass(this.classOn);
                if (!this.element.hasClass(this.classOff)) {
                    this.element.addClass(this.classOff);
                }
            }
        }
    }

    setIconOn(newIcon) {
        this.element.removeClass(this.iconOn + "_icon");
        this.iconOn = newIcon;
        if (this.isOn) {
            this.element.addClass(this.iconOn + "_icon");
        }

        this.applyStateChange();
    }
    setIconOff(newIcon) {
        this.element.removeClass(this.iconOff + "_icon");
        this.iconOff = newIcon;
        if (this.isOff) {
            this.element.addClass(this.iconOff + "_icon");
        }
        this.applyStateChange();
    }

    setOn() {
        if (!this.isOn) {
            this.isOn = true;
            this.clickedOn();
            this.applyStateChange();
        }
    }
    setOff() {
        if (this.isOn) {
            this.isOn = false;
            this.clickedOff();
            this.applyStateChange();
        }
    }
}
