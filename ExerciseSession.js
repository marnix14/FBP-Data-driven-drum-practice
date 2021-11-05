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
        console.log("Recording");
        this.isRecording = true;
    }
    stopRecording() {
        this.isRecording = false;
    }
}
