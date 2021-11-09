class SelectionList {
    element;
    itemList = [];
    selectedItemIndex;
    onSelect;

    constructor(title, items, onSelect) {
        this.element = createDiv();
        this.title = createDiv(title);
        this.title.parent(this.element);
        this.title.class("selectionListTitle");
        this.element.position(0, 0);
        this.element.class("selectionList");
        for (const item of items) {
            this.itemList.push(new SelectionListItem(this, item));
        }
        this.onSelect = onSelect;

        this.selectedItemIndex = 0;
        this.getSelectedItem().select();
    }

    getSelectedItem() {
        return this.itemList[this.selectedItemIndex];
    }
    selectItemIndex(index) {
        if (index < 0 || index >= this.itemList.length) throw Error("Selecting item that doesn't exist");
        this.getSelectedItem().deselect();
        this.selectedItemIndex = index;
        this.getSelectedItem().select();
        this.onSelect(this.getSelectedItem().getObject());
    }
    selectItem(item) {
        this.selectItemIndex(this.itemList.indexOf(item));
    }

    remove() {
        this.element.remove();
    }
}
