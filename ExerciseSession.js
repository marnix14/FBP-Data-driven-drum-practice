// holds an exercise and a practice session recording
class ExerciseSession {
    exercise;
    exerciseRepeats;
    startTimestamp;
    beatsPerMinute;

    isRecording = false;

    constructor(exercise) {
        this.exercise = exercise;
    }

    startRecording() {
        console.log("Recording session started");
        this.isRecording = true;
    }
    stopRecording() {
        console.log("Recording session stopped");
        this.isRecording = false;
    }
}
