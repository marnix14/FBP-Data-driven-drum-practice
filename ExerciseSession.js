// holds an exercise and a practice session recording
class ExerciseSession {
    exercise;
    repeats;
    startTimestamp;
    beatsPerMinute;

    recording = [];
    analysis = [];

    isRecording = false;

    constructor(exercise, repeats) {
        this.exercise = exercise;
        this.repeats = repeats;
        if (this.exercise) {
            for (const exerciseHit of exercise.hitNotes) {
                this.analysis.push(new HitAnalysis(exerciseHit));
            }
        }
    }

    resetRecording() {
        console.log("Recording session reset");
        this.startTimestamp = null;
        this.recording = [];
        this.isRecording = false;
    }

    startRecording(startTimestamp, beatsPerMinute) {
        if (this.recording.length > 0) {
            throw Error("There is already a recording in this session");
        }
        this.startTimestamp = startTimestamp;
        this.beatsPerMinute = beatsPerMinute;
        console.log(
            "Recording session started at",
            new Date(startTimestamp).toISOString(),
            "with bpm of",
            beatsPerMinute
        );
        this.isRecording = true;
    }
    stopRecording() {
        this.isRecording = false;
        console.log("Recording session stopped");
        if (this.recording.length > 0) {
            this.save();
        } else {
            this.resetRecording();
        }
    }

    save() {
        ExerciseSessionHistory.addNewSession(this);
    }

    padInput(timedHit) {
        if (this.isRecording) {
            this.recording.push(timedHit);
            const exerciseHitAnalysis = this.getClosestExerciseHit(timedHit);
            exerciseHitAnalysis.addHit(timedHit);
            exerciseHitAnalysis.analyse(this.exercise);
        }
    }

    static fromJSON(exerciseSessionJSON) {
        let exerciseSession = Object.assign(new ExerciseSession(), exerciseSessionJSON);
        console.log(exerciseSession)
        for (let i = 0; i < exerciseSession.recording.length; i++) {
            exerciseSession.recording[i] = Object.assign(new TimedHitNote(), exerciseSession.recording[i]);
        }
        for (let i = 0; i < exerciseSession.analysis.length; i++) {
            exerciseSession.analysis[i] = Object.assign(new HitAnalysis(new TimedHitNote()), exerciseSession.analysis[i]);
            for (let j = 0; j < exerciseSession.analysis[i].recordedHits.length; j++) {
                exerciseSession.analysis[i].recordedHits[j] = Object.assign(new TimedHit(), exerciseSession.analysis[i].recordedHits[j] );
            }
            for (let j = 0; j < exerciseSession.analysis[i].wrongHits.length; j++) {
                exerciseSession.analysis[i].wrongHits[j] = Object.assign(new TimedHit(), exerciseSession.analysis[i].wrongHits[j] );
            }
        }
        exerciseSession.exercise = Exercise.fromTransformedRudimentJSON(exerciseSession.exercise);
        console.log(exerciseSession)

        return exerciseSession;
    }

    hasRecorded() {
        return this.recording.length > 0;
    }

    getClosestExerciseHit(recordedHit) {
        let closestExerciseHit = null;
        let closestExerciseHitDistance = Number.POSITIVE_INFINITY;
        for (const i in this.analysis) {
            const exerciseHit = this.analysis[i];
            const distance = abs(
                getWrappedOffset(recordedHit.barPosition, exerciseHit.barPosition, this.exercise.bars)
            );

            if (distance < closestExerciseHitDistance) {
                closestExerciseHitDistance = distance;
                closestExerciseHit = exerciseHit;
            }
        }

        return closestExerciseHit;
    }
}
