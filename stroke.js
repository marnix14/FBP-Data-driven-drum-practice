class Stroke {
    velocity;
    dexterity;
    subdivision;
    accent;

    radius = 50;
    lineLength = 100;




    constructor(dext, subdivision) {

        if (dext.toUpperCase() == dext) {
            this.accent = true;
            this.radius = 1.2 * this.radius;
        }
        this.dexterity = dext.toLowerCase();

        this.subdivision = subdivision;

    }
    display(x, y, shape, size, spacing, opacity, sw) {
        noFill();
        let s;
        if (this.accent) {
            //fill(255);
            strokeWeight(sw);
            stroke(255);
            s = size;



        }
        else {
            noFill();
            strokeWeight(3);
            stroke(255, 255, 255, opacity);
            s = size/2;
            
        }
        switch (shape) {
            case 'circle':
                ellipse(x + this.getDextSign() * (this.radius + spacing), y, this.radius * 2 * s, this.radius * 2 * s);
                break;
            case 'line':
                line(x + this.getDextSign() * spacing, y, x + this.getDextSign() * (spacing + this.lineLength * s), y);
                break;
            case 'triangle':
                triangle(x + this.getDextSign() * spacing, y, x + this.getDextSign() * (spacing + Math.sqrt(3) * this.lineLength * s), y + this.lineLength*s, x + this.getDextSign() * (spacing + Math.sqrt(3) * this.lineLength*s), y - s*this.lineLength);
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


