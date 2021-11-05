class TimedHit extends Hit {
    beatPosition;
    barPosition;

    constructor(dexterity, velocity, beatPosition, barPosition) {
        super(dexterity, velocity);
        this.beatPosition = beatPosition;
        this.barPosition = barPosition;
    }

    static fromHitAndMetronome(hit, metronome) {
        return new TimedHit(hit.dexterity, hit.velocity, metronome.getBeatPosition(), metronome.getBarPosition());
    }
}
