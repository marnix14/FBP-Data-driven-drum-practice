class View {
    app;
    constructor(app) {
        this.app = app;
    }
    update() {
        console.warn("update method of current view not defined");
    }

    draw() {
        console.warn("draw method of current view not defined");
    }

    keyPressed() {
        console.warn("keyPressed method of current view not defined");
    }

    destroy() {
        console.warn("destroy method of current view not defined");
    }

    padInput(hit) {
        console.warn("padInput method of current view not defined");
    }

    switchTo() {}
}
