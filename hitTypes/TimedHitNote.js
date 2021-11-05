class TimedHitNote extends HitNote {
    beatPosition;
    barPosition;

    constructor(dexterity, velocity, beatDivision, flag, beatPosition, barPosition) {
        super(dexterity, velocity, beatDivision, flag);
        this.beatPosition = beatPosition;
        this.barPosition = barPosition;
    }

    static fromHitNote(hitNote, beatPosition, barPosition) {
        return new TimedHitNote(
            hitNote.dexterity,
            hitNote.velocity,
            hitNote.beatDivision,
            hitNote.flag,
            beatPosition,
            barPosition
        );
    }
}
