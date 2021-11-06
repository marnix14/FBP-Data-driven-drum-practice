// Keeps track of all the user's exercises sessions
class ExerciseSessionHistory {
    static exerciseSessions = [];

    static testExerciseSession;

    static preload() {
        loadJSON("assets/data/testExerciseSessionHistory.json", (result) => {
            ExerciseSessionHistory.testExerciseSession = ExerciseSession.fromJSON(result[0]);
        });
    }

    static addNewSession(exerciseSession) {
        this.exerciseSessions.push(exerciseSession);
        this.saveToJSON();
    }

    static saveToJSON() {
        //saveJSON(this.exerciseSessions, "testExerciseSessionHistory.json");
    }
}
