const standardVelocity = 0.5;
const accentVelocity = 1;

class Stroke {
    #isLeftHand;
    velocity;

    constructor(isLeftHand, velocity) {
        this.#isLeftHand = isLeftHand;
        this.velocity = velocity;
    }

    isLeftHand() {
        return this.#isLeftHand;
    }
    isRightHand() {
        return !this.#isLeftHand;
    }
    getDexterityString() {
        return this.#isLeftHand ? "left" : "right";
    }
    getDexterityLetter() {
        return this.#isLeftHand ? "l" : "r";
    }

    static fromStickingChar(stickingChar) {
        const lowerCaseStickingChar = stickingChar.toLowerCase();
        const isLowercase = stickingChar === lowerCaseStickingChar;
        const isLeftHand = lowerCaseStickingChar === "l";
        const velocity = isLowercase ? standardVelocity : accentVelocity;
        return new Stroke(isLeftHand, velocity);
    }
}
