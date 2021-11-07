class ExerciseSoundPlayer {
    exercise;
    metronome;

    selectedSound;

    static velocityDivisions = 4;
    static panningAmount = 0.4;

    focus = 0;

    isMuted = true;

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
        if (this.isMuted) return;
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
        let focusGain = 1;
        if (hit.isRightHand()) {
            focusGain = min(1, this.focus + 1);
        } else {
            focusGain = -max(-1, this.focus - 1);
        }
        ExerciseSoundPlayer.playHit(hit.velocity, hit.getDexteritySign(), focusGain);
    }

    static playHit(vel, dext = 0, gain = 1) {
        if (vel == 0) return;
        const velocityNumber = min(1, vel) * ExerciseSoundPlayer.velocityDivisions;
        const soundNumber = ceil(velocityNumber) - 1;

        let velocity = 1;
        const velocityRemainder = vel % ExerciseSoundPlayer.velocityDivisions;
        if (velocityRemainder > 0) {
            velocity =
                (ExerciseSoundPlayer.velocityDivisions - 1 + velocityRemainder) / ExerciseSoundPlayer.velocityDivisions;
        }

        const randomSelection = int(random(2));
        const sound = ExerciseSoundPlayer.padSounds["default"][soundNumber][randomSelection];
        const pan = dext * ExerciseSoundPlayer.panningAmount;
        const pitchChange = 1 + 0.05 * dext;

        sound.play(velocity * gain, pitchChange, pan);
    }

    setFocus(focus) {
        this.focus = focus;
    }

    mute() {
        this.isMuted = true;
    }

    unmute() {
        this.isMuted = false;
    }
}
