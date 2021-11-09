class SelectionListItem {
    object;
    element;
    isSelected = false;
    descriptionElement;

    constructor(parent, object) {
        this.element = createDiv();
        this.element.class("selectionListItem");
        this.element.parent(parent.element);
        this.element.mousePressed(() => parent.selectItem(this));
        this.object = object;

        this.titleElement = createDiv(object.name);
        this.titleElement.class("selectionListItemTitle");
        this.titleElement.parent(this.element);

        this.descriptionElement = createDiv(object.description);
        this.descriptionElement.class("selectionListItemDescription");
        this.descriptionElement.parent(this.element);
        this.descriptionElement.hide();
    }

    select() {
        if (this.isSelected) return;
        this.addDescription();
        this.isSelected = true;
        this.element.addClass("selected");
        this.titleElement.addClass("selectedText");
    }

    deselect() {
        if (!this.isSelected) return;
        this.removeDescription();
        this.isSelected = false;
        this.element.removeClass("selected");
        this.titleElement.removeClass("selectedText");
    }
    getObject() {
        return this.object;
    }

    addDescription() {
        this.descriptionElement.show();
    }

    removeDescription() {
        this.descriptionElement.hide();
    }
}
