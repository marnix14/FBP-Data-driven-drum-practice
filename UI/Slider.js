class Slider extends UIElement {
    vertical;
    size;
    input;
    min;
    max;
    val;
    step;
    input;
    barThickness;

    /**
     * Pass options for slider creation
     * @param {Object} options
     * @param {number} options.x
     * @param {number} options.y
     * @param {number} options.size (px) if vertical determines the height, otherwise the width
     * @param {boolean} options.startDisabled whether the button should be disabled by default
     * @param {function} options.input the function that gets called when the slider is moved
     * @param {string} options.class the css class applied to the slider
     */
    constructor(options) {
        super(options);
        this.min = options.min ?? 0;
        this.max = options.max ?? 1;
        this.val = options.val ?? this.min;
        this.step = options.step ?? 0;
        this.vertical = options.vertical ?? false;
        this.size = options.size ?? 40;
        this.class = options.class ?? "slider";
        this.input = options.input;
        this.barThickness = options.barThickness ?? 8;

        this.element = createSlider(this.min, this.max, this.val, this.step);
        this.applyCoreStyle();
        if (this.vertical) {
            this.element.style("height", `${this.size}px`);
            this.element.style("width", `${this.barThickness}px`);
        } else {
            this.element.style("height", `${this.barThickness}px`);
            this.element.style("width", `${this.size}px`);
        }

        this.element.input(() => this.input(this.element.value()));
        this.element.doubleClicked(() => {
            this.element.value(0);
            this.input(this.element.value());
        });
    }
}
