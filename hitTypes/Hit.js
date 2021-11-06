class Hit {
    static standardVelocity = 0.5;
    static accentVelocity = 1;

    dexterity;
    velocity;

    constructor(dexterity, velocity) {
        this.dexterity = dexterity;
        this.velocity = velocity;
    }

    isLeftHand() {
        return this.dexterity === "l";
    }
    isRightHand() {
        return this.dexterity === "r";
    }
    getDexterityString() {
        switch (this.dexterity) {
            case "l":
                return "left";
            case "r":
                return "right";
            case "b":
                return "both";
            default:
                return "rest";
        }
    }

    getDexteritySign() {
        return this.isRightHand() ? 1 : -1;
    }

    getDexterity() {
        return this.dexterity;
    }

    setAccent(isAccent) {
        this.velocity = Hit.accentToVelocity(isAccent);
    }

    isAccent(accentThreshold = 0.75) {
        return this.velocity >= accentThreshold;
    }

    static fromStickingChar(stickingChar) {
        const lowerCaseStickingChar = stickingChar.toLowerCase();
        const isLowercase = stickingChar === lowerCaseStickingChar;
        const velocity = isLowercase ? standardVelocity : accentVelocity;
        return new Hit(lowerCaseStickingChar, velocity);
    }

    static invertDexterity(dexterity) {
        switch (dexterity) {
            case "l":
                return "r";
            case "r":
                return "l";
            default:
                return dexterity;
        }
    }

    static accentToVelocity(isAccent) {
        return isAccent ? this.accentVelocity : this.standardVelocity;
    }
}
