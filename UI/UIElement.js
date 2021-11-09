class UIElement {
    element;
    x;
    y;
    class;
    clicked;
    disabled;

    /**
     * Pass options for element creation
     * @param {Object} options
     * @param {number} options.x
     * @param {number} options.y
     * @param {boolean} options.startDisabled whether the element should be disabled by default
     * @param {function} options.clicked the function that gets called when the element is clicked
     * @param {string} options.class the css class applied to the element
     */
    constructor(options) {
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.disabled = options.startDisabled ?? false;
        this.class = options.class ?? "";
        this.clicked = options.clicked;
    }

    applyCoreStyle() {
        if (this.disabled) {
            this.element.hide();
        }
        this.applyDisabled();
        this.element.class(this.class);
        if (this.clicked) {
            this.element.mousePressed(this.clicked);
        }
        this.element.position(this.x, this.y);
    }

    applyDisabled() {
        if (this.disabled) {
            this.element.attribute("disabled", "");
            this.element.style("opacity", 0);
            setTimeout(() => {
                this.element.hide();
            }, 100);
        } else {
            this.element.show();
            this.element.style("opacity", 1);
            this.element.removeAttribute("disabled");
        }
    }
    remove() {
        this.element.remove();
    }

    disable() {
        this.disabled = true;
        this.applyDisabled();
    }

    enable() {
        this.disabled = false;
        this.applyDisabled();
    }
}
