class Stroke {
    velocity;
    dexterity;
    subdivision;
    radius = 10;
    accent;
    x;
    y;
    shape;
    lineSize = 100;
    opacity;


    constructor(dext, subdivision) {

        if (dext.toUpperCase() == dext) {
            this.accent = true;
            this.radius = 1.2 * this.radius;
        }
        this.dexterity = dext.toLowerCase();

        this.subdivision = subdivision;

    }
    display(x, y, shape, spacing, opacity, sw) {
        noFill();
        if (this.accent) {
            //fill(255);
            strokeWeight(sw);
            stroke(255);

        }
        else {
            noFill();
            strokeWeight(3);
            stroke(255, 255, 255, opacity);
        }
        switch (shape) {
            case 'circle':
                ellipse(x + this.getDextSign() * (this.radius + spacing), y, this.radius * 2, this.radius * 2);
                break;
            case 'line':
                line(x + this.getDextSign() * spacing, y, x + this.getDextSign() * (spacing + this.lineSize), y);
                break;
        }

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


