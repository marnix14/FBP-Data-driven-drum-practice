class IconButton {
    element;
    x;
    y;
    text;
    icon;
    class;
    clicked;
    disabled;

    /**
     * Pass options for button creation
     * @param {Object} options
     * @param {number} options.x
     * @param {number} options.y
     * @param {string} options.text text inside the button
     * @param {string} options.icon icon inside the button (filename in assets/icons)
     * @param {boolean} options.startDisabled whether the button should be disabled by default
     * @param {function} options.clicked the function that gets called when the button is clicked
     * @param {string} options.class the css class applied to the button
     */
    constructor(options) {
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.text = options.text ?? "";
        this.icon = options.icon;
        this.disabled = options.startDisabled ?? false;
        this.class = options.class ?? "button";
        this.clicked = options.clicked;

        this.element = createButton(this.text);
        if (this.disabled) {
            this.element.style("visibility", "hidden");
        }
        this.applyDisabled();

        this.element.class(this.class);
        if (this.icon) {
            this.element.addClass(this.icon + "_icon");
        }

        this.element.mousePressed(this.clicked);
        this.element.position(this.x, this.y);
    }

    applyDisabled() {
        if (this.disabled) {
            this.element.attribute("disabled", "");
        } else {
            this.element.style("visibility", "visible");

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
