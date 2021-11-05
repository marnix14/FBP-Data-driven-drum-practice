// holds an exercise and a practice session recording
class ExerciseSession {
    exercise;
    exerciseRepeats;
    startTimestamp;
    beatsPerMinute;

    recording = [];

    analysis = {};

    isRecording = false;

    constructor(exercise) {
        this.exercise = exercise;
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
        console.log("Recording session stopped");
        console.log(this.recording);
        this.isRecording = false;
        this.analyse();
        this.save();
    }

    analyse() {
        console.log("Analysing recording session");
        const barsPerSecond = this.beatsPerMinute / this.exercise.beatsPerBar / 60;
        for (const timedHit of this.recording) {
            const second = timedHit.barPosition / barsPerSecond;
        }
    }

    save() {
        ExerciseSessionHistory.addNewSession(this);
    }

    padInput(timedHit) {
        console.log(timedHit);

        if (this.isRecording) {
            this.recording.push(timedHit);
        }
    }
}
