
class Vehicle {
    constructor(x, y) {
        this.pos = createVector(random(width), random(height));
        this.target = createVector(x, y);

        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.r = 10;
        this.maxspeed = 10;
        this.maxforce = 1;

        this.color = color(random(255), random(255), random(255));
    }

    behaviours() {
        let arrive = this.arrive(this.target, 100);

        let mouse = createVector(mouseX, mouseY);
        let flee = this.flee(mouse, 50);

        arrive.mult(1);
        flee.mult(5)

        this.applyForce(arrive);
        this.applyForce(flee);

    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
    }

    show() {
        // Color Changing (Flickering)
        // let c = color(random(180) + 50, random(180) + 50, random(180) + 50);
        // stroke(c);

        // Single Random Color for each particle
        // stroke(this.color);

        // White
        stroke(255);

        strokeWeight(this.r);
        point(this.pos.x, this.pos.y);
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.pos);
        desired.setMag(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce)
        return steer;
    }

    flee(target, distance) {
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        if (d < distance) {
            desired.setMag(this.maxspeed);
            desired.mult(-1)
            let steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce)
            return steer;
        }
        else {
            return createVector(0, 0);
        }
    }

    arrive(target, distance) {
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let speed = this.maxspeed;
        if (d < distance) {
            speed = map(d, 0, 100, 0, this.maxspeed)
        }
        desired.setMag(speed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce)
        return steer;
    }
}

let font;
let vehicles = [];

function preload() {
    font = loadFont('IMPACT.ttf');
}

function setup() {
    createCanvas(800, 280);

    const dots = font.textToPoints('Hrishik', 50, 200, 200);

    dots.forEach(dot => {
        let vehicle = new Vehicle(dot.x, dot.y);
        vehicles.push(vehicle);
    });

}

function draw() {
    background(51);

    vehicles.forEach(v => {
        v.behaviours();
        v.update();
        v.show();
    });

    // noLoop();

}