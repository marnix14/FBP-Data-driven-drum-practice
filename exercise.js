class Exercise {
    static EMPTY = new Exercise("Empty", "Do what you want!", 4);

    name = "Unnamed";
    description = "No description.";
    structure = [];
    hitNotes = [];

    accentPlacement = "none";
    beatsPerBar = 4;
    beats = 0;
    bars = 0;

    constructor(name, description, beatsPerBar) {
        this.name = name;
        this.description = description;
        this.beatsPerBar = beatsPerBar;
    }

    static fromTransformedRudimentJSON(exerciseJSON) {
        let exercise = new Exercise(exerciseJSON.name, exerciseJSON.description, exerciseJSON.beatsPerBar);
        exercise.accentPlacement = exerciseJSON.accentPlacement;
        exercise.structure = exerciseJSON.structure;

        for (const structureNotatedRudiment of exerciseJSON.structure) {
            exercise.hitNotes.push(...Exercise.transformedRudiment(structureNotatedRudiment));
        }

        exercise.processHitNotes();

        // Calculate number of beats and bars
        const beats = Exercise.countBeats(exercise.hitNotes);
        exercise.beats = beats;
        exercise.bars = beats / exercise.beatsPerBar;

        return exercise;
    }

    static fromJSON(json) {
        console.log(json);
    }

    processHitNotes() {
        for (let i = 0; i < this.hitNotes.length; i++) {
            const beatPosition = Exercise.countBeats(this.hitNotes.slice(0, i));
            const barPosition = beatPosition / this.beatsPerBar;
            this.hitNotes[i] = TimedHitNote.fromHitNote(this.hitNotes[i], beatPosition, barPosition);
            this.placeAccents(i, beatPosition);
        }
    }

    placeAccents(i, beatPosition) {
        if (this.accentPlacement === "beat") {
            this.hitNotes[i].setAccent(beatPosition % 1 === 0);
        }
        if (this.accentPlacement === "none") {
            this.hitNotes[i].setAccent(false);
        }
    }

    static countBeats(hitNotes, floatingPointErrorOrder = 5) {
        const errorMultiplier = Math.pow(10, floatingPointErrorOrder);
        let beats = 0;
        for (const i in hitNotes) {
            const hitNote = hitNotes[i];
            beats += 1 / hitNote.beatDivision;
            let correctedBeats = round(beats * errorMultiplier) / errorMultiplier;
            if (correctedBeats === round(beats)) {
                beats = correctedBeats;
            }
        }
        return beats;
    }

    static transformedRudiment(structureNotatedRudiment) {
        const hitNotes = [];
        const [abbr, beatDivision, repeat, invert] = structureNotatedRudiment;
        const rudiment = Rudiments.getByAbbr(abbr);

        for (let r = 0; r < repeat; r++) {
            for (const i in rudiment.pattern) {
                const [dexterity, flag] = rudiment.pattern[i];
                const transformedDexterity = invert ? HitNote.invertDexterity(dexterity) : dexterity;
                const velocity = HitNote.accentToVelocity(i == 0);
                hitNotes.push(new HitNote(transformedDexterity, velocity, beatDivision, flag));
            }
        }

        return hitNotes;
    }
}
