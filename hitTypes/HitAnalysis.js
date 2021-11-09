class HitAnalysis extends TimedHitNote {
    recordedHits = [];
    wrongHits = [];

    dexterityAccuracy;

    relativePositionMean;
    positionDeviation;
    positionAccuracy; // 0 is maxErrorInBeats of offset
    positionPrecision; // 0 is a maxErrorInBeats of standard deviation

    velocityMean;
    velocityDeviation;
    velocityAccuracy; // 0 when maxErrorVelocity difference
    velocityPrecision; // 0 when maxErrorVelocity deviation

    constructor(timedHitNote) {
        super(
            timedHitNote.dexterity,
            timedHitNote.velocity,
            timedHitNote.beatDivision,
            timedHitNote.flag,
            timedHitNote.beatPosition,
            timedHitNote.barPosition
        );
    }

    addHit(hit) {
        if (this.dexterity == hit.dexterity) {
            this.recordedHits.push(hit);
        } else {
            this.wrongHits.push(hit);
        }
    }

    analyse(exercise) {
        if (this.recordedHits.length === 0) return;
        // offset from exercise to recorded hit
        let relativePositionSum = 0;
        let velocitySum = 0;
        for (const recordedHit of this.recordedHits) {
            relativePositionSum += getWrappedOffset(this.barPosition, recordedHit.barPosition, exercise.bars);
            velocitySum += recordedHit.velocity;
        }
        this.relativePositionMean = relativePositionSum / this.recordedHits.length;
        this.velocityMean = velocitySum / this.recordedHits.length;

        let squareDifferencePositionSum = 0;
        let squareDifferenceVelocitySum = 0;
        for (const recordedHit of this.recordedHits) {
            const wrappedOffset = getWrappedOffset(this.barPosition, recordedHit.barPosition, exercise.bars);

            squareDifferencePositionSum += pow(
                getWrappedOffset(this.relativePositionMean, wrappedOffset, exercise.bars),
                2
            );
            squareDifferenceVelocitySum += pow(this.velocityMean - recordedHit.velocity, 2);
        }
        this.positionDeviation = sqrt(squareDifferencePositionSum / this.recordedHits.length);
        this.velocityDeviation = sqrt(squareDifferenceVelocitySum / this.recordedHits.length);

        this.positionAccuracy =
            1 - min(1, (abs(this.relativePositionMean) * exercise.beatsPerBar) / Settings.maxErrorInBeats);
        this.positionPrecision = 1 - min(1, (this.positionDeviation * exercise.beatsPerBar) / Settings.maxErrorInBeats);

        this.velocityAccuracy = max(0, 1 - abs(this.velocity - this.velocityMean) / Settings.maxErrorInVelocity);
        this.velocityPrecision = max(0, 1 - this.velocityDeviation / Settings.maxErrorInVelocity);

        this.dexterityAccuracy = this.recordedHits.length / (this.recordedHits.length + this.wrongHits.length);
    }
}
