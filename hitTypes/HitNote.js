class HitNote extends Hit {
    beatDivision = 1;
    flag = "";

    constructor(dexterity, velocity, beatDivision, flag) {
        super(dexterity, velocity);
        this.beatDivision = beatDivision;
        this.flag = flag;
    }
}
