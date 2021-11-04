// Represents database of exercises
class Exercises {
    static data = [];
    static exercises = [];

    static loadJSON(file) {
        console.log("Loading exercises json: ", file);
        this.data = file;
        for (const exerciseJSON of this.data) {
            this.exercises.push(Exercise.fromJSON(exerciseJSON));
        }
        console.log(this.exercises);
    }
}
