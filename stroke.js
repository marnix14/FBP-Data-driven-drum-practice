class Stroke {
    velocity;
    dexterity;
    subdivision;
    radius = 10;
    accent;
    x;
    y;

    constructor(dext, subdivision) {

        if (dext.toUpperCase() == dext) {
            this.accent = true;
            this.radius = 1.2 * this.radius;
        }
        this.dexterity = dext.toLowerCase();

        this.subdivision = subdivision;

    }
    display(x, y) {
        strokeWeight(2);
        if (this.accent) {
            fill(255);
        }
        else {

            noFill();
        }
        stroke(255);

        ellipse(x + this.getDextSign() * this.radius, y, this.radius * 2, this.radius * 2);
    }

    getDextSign() {
        if (this.dexterity == 'l') {
            return -1;
        }
        else {
            return 1;
        }
    }

}


