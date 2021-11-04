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

    static fromJSON(exerciseJSON) {
        let exercise = new Exercise(exerciseJSON.name, exerciseJSON.description, exerciseJSON.beatsPerBar);
        exercise.accentPlacement = exerciseJSON.accentPlacement;
        exercise.structure = exerciseJSON.structure;

        for (const structureNotatedRudiment of exerciseJSON.structure) {
            exercise.hitNotes.push(...this.transformedRudiment(structureNotatedRudiment));
        }

        // Calculate number of beats and bars
        const beats = this.countBeats(exercise.hitNotes);
        exercise.beats = beats;
        exercise.bars = beats / exercise.beatsPerBar;

        // Set accent placement
        for (let i = 0; i < exercise.hitNotes.length; i++) {
            if (exercise.accentPlacement === "beat") {
                const beatsSoFar = this.countBeats(exercise.hitNotes.slice(0, i));
                const isAccent = beatsSoFar % 1 === 0;
                exercise.hitNotes[i].setAccent(isAccent);
            }
            if (exercise.accentPlacement === "none") {
                exercise.hitNotes[i].setAccent(false);
            }
        }

        return exercise;
    }

    static countBeats(hitNotes, floatingPointErrorOrder = 5) {
        const errorMultiplier = Math.pow(10, floatingPointErrorOrder);
        let beats = 0;
        for (const hitNote of hitNotes) {
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
