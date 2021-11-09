class ExerciseSoundPlayer {
    exercise;
    metronome;

    selectedSound;

    static velocityDivisions = 4;
    static panningAmount = 0.4;

    focus = 0;

    isMuted = true;

    static hitSoundNames = ["snare", "hat", "tom", "conga"];
    static hitSounds = {};
    selectedSound = 1;

    constructor(metronome) {
        this.metronome = metronome;
    }

    setExercise(exercise) {
        this.exercise = exercise;
    }

    static preload() {
        for (const name of ExerciseSoundPlayer.hitSoundNames) {
            ExerciseSoundPlayer.hitSounds[name] = [];
            for (let i = 0; i < ExerciseSoundPlayer.velocityDivisions; i++) {
                ExerciseSoundPlayer.hitSounds[name][i] = [];
                ExerciseSoundPlayer.hitSounds[name][i][0] = new Sound(`/assets/sounds/hit/${name}_${i}a.ogg`);
                ExerciseSoundPlayer.hitSounds[name][i][1] = new Sound(`/assets/sounds/hit/${name}_${i}b.ogg`);
            }
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
        ExerciseSoundPlayer.playHit(hit.velocity, hit.getDexteritySign(), focusGain, this.getSelectedSoundName());
    }

    static playHit(vel, dext = 0, gain = 1, soundName = "snare") {
        if (vel == 0) return;
        let rate = 1;

        const velocityNumber = min(1, vel) * ExerciseSoundPlayer.velocityDivisions;
        const soundNumber = ceil(velocityNumber) - 1;

        let velocity = 1;

        const velocityRemainder = velocityNumber % 1;
        if (velocityRemainder > 0) {
            const velocitySplitBase = soundNumber / ExerciseSoundPlayer.velocityDivisions;
            const velocitySplitRest =
                (ExerciseSoundPlayer.velocityDivisions - soundNumber) / ExerciseSoundPlayer.velocityDivisions;
            velocity = velocitySplitBase + velocitySplitRest * velocityRemainder;
        }

        const randomABSelection = int(random(2));
        const dexterityABSeleciton = int(dext / 2 + 0.5);
        const randomGain = 1 + (random() - 0.5) * 0.4;
        const randomPitch = 1 + (random() - 0.5) * 0.01;
        gain *= randomGain;
        rate *= randomPitch;
        const sound = ExerciseSoundPlayer.hitSounds[soundName][soundNumber][dexterityABSeleciton];
        const pan = dext * ExerciseSoundPlayer.panningAmount;
        sound.play(vel * gain * Settings.hitVolume, rate, pan);
    }

    setFocus(focus) {
        this.focus = focus;
    }

    getSelectedSound() {
        return ExerciseSoundPlayer.hitSounds[ExerciseSoundPlayer.hitSoundNames[this.selectedSound]];
    }
    getSelectedSoundName() {
        return ExerciseSoundPlayer.hitSoundNames[this.selectedSound];
    }
    selectPreviousSound() {
        this.selectedSound =
            (ExerciseSoundPlayer.hitSoundNames.length + this.selectedSound - 1) %
            ExerciseSoundPlayer.hitSoundNames.length;
    }
    selectNextSound() {
        this.selectedSound = (this.selectedSound + 1) % ExerciseSoundPlayer.hitSoundNames.length;
    }

    mute() {
        this.isMuted = true;
    }

    unmute() {
        this.isMuted = false;
    }
}
