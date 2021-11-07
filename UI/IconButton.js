class IconButton extends UIElement {
    text;
    icon;
    size;

    /**
     * Pass options for button creation
     * @param {Object} options
     * @param {number} options.x
     * @param {number} options.y
     * @param {number} options.size the width and height in pixels
     * @param {string} options.text text inside the button
     * @param {string} options.icon icon inside the button (filename in assets/icons)
     * @param {boolean} options.startDisabled whether the button should be disabled by default
     * @param {function} options.clicked the function that gets called when the button is clicked
     * @param {string} options.class the css class applied to the button
     */
    constructor(options) {
        super(options);
        this.size = options.size ?? 40;
        this.text = options.text ?? "";
        this.icon = options.icon;
        this.class = options.class ?? "button";

        this.element = createButton(this.text);
        this.applyCoreStyle();
        if (this.icon) {
            this.element.addClass(this.icon + "_icon");
        }
        this.element.size(this.size, this.size);
    }
}
