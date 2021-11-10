class TimedHit extends Hit {
    beatPosition;
    barPosition;

    constructor(dexterity, velocity, beatPosition, barPosition) {
        super(dexterity, velocity);
        this.beatPosition = beatPosition;
        this.barPosition = barPosition;
    }

    static fromHitAndMetronome(hit, metronome, latencyInMs = 0) {
        const barLatency = metronome.millisecondsToBars(latencyInMs);
        const beatLatency = barLatency * metronome.beatsPerBar;
        return new TimedHit(
            hit.dexterity,
            hit.velocity,
            metronome.getBeatPosition() - beatLatency,
            metronome.getBarPosition() - barLatency
        );
    }
}
