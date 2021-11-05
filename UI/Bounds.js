class Bounds {
    x;
    y;
    w;
    h;
    width;
    height;

    right;
    left;
    top;
    bottom;
    centerX;
    centerY;

    setBounds(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.w = width;
        this.h = height;
        this.left = x;
        this.right = x + width;
        this.top = y;
        this.bottom = y + height;
        this.centerX = x + width / 2;
        this.centerY = y + height / 2;
    }
}
