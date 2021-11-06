class ExerciseSoundPlayer {
    exercise;
    metronome;

    selectedSound;

    static velocityDivisions = 4;
    static panningAmount = 0.4;

    static padSounds = {};

    constructor(exercise, metronome, selectedSound = "default") {
        this.exercise = exercise;
        this.metronome = metronome;
        this.selectedSound = selectedSound;
    }

    static preload() {
        ExerciseSoundPlayer.padSounds["default"] = [];
        for (let i = 0; i < ExerciseSoundPlayer.velocityDivisions; i++) {
            const velocityPercentage = ((i + 1) * 100) / ExerciseSoundPlayer.velocityDivisions;
            ExerciseSoundPlayer.padSounds["default"].push([]);
            ExerciseSoundPlayer.padSounds["default"][i].push(
                new Sound(`/assets/sounds/pad/snare${velocityPercentage}a.mp3`)
            );
            ExerciseSoundPlayer.padSounds["default"][i].push(
                new Sound(`/assets/sounds/pad/snare${velocityPercentage}b.mp3`)
            );
        }
    }

    update() {
        if (!this.metronome.isPlaying) return;
        for (const hitNote of this.exercise.hitNotes) {
            const passedNote =
                this.metronome.getPreviousBarPosition() % this.exercise.bars <= hitNote.barPosition &&
                this.metronome.getBarPosition() % this.exercise.bars > hitNote.barPosition;
            const wrapped =
                ceil(this.metronome.getPreviousBarPosition() / this.exercise.bars) !=
                ceil(this.metronome.getBarPosition() / this.exercise.bars);
            const passedFirstNote = wrapped && hitNote.barPosition == 0;
            if (passedNote || passedFirstNote) {
                this.playHitSound(hitNote);
            }
        }
    }

    playHitSound(hit) {
        const velocityNumber = hit.velocity * ExerciseSoundPlayer.velocityDivisions;
        const soundNumber = ceil(velocityNumber) - 1;

        let velocityMultiplier = 1;
        const velocityRemainder = hit.velocity % ExerciseSoundPlayer.velocityDivisions;
        if (velocityRemainder > 0) {
            velocityMultiplier =
                (ExerciseSoundPlayer.velocityDivisions - 1 + velocityRemainder) / ExerciseSoundPlayer.velocityDivisions;
        }

        const randomSelection = int(random(2));

        const sound = ExerciseSoundPlayer.padSounds[this.selectedSound][soundNumber][randomSelection];
        const pan = hit.getDexteritySign() * ExerciseSoundPlayer.panningAmount;
        const pitchChange = 1 + 0.05 * hit.getDexteritySign();
        sound.play(velocityMultiplier, pitchChange, pan);
    }
}
