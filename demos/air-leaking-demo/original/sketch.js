let particles = [];

function setup() {
  createCanvas(600, 600);
  noStroke();
  rectMode(CENTER);
  clear(); // initialize transparent background
}

function draw() {
  clear(); // ensure background stays transparent on each frame

  // Draw building as a top-view rectangle
  fill(100);
  rect(width / 2, height / 2, 300, 300);

  // Emit particles from edges to simulate leaks
  emitLeaks();

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    if (p.isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function emitLeaks() {
  let edges = [
    {x: random(250, 350), y: 150, type: "hot"}, // top leak (hot)
    {x: random(250, 350), y: 450, type: "cool"}, // bottom leak (cool)
    {x: 150, y: random(250, 350), type: "cool"}, // left leak (cool)
    {x: 450, y: random(250, 350), type: "hot"}  // right leak (hot)
  ];

  for (let e of edges) {
    particles.push(new Particle(e.x, e.y, e.type));
  }
}

class Particle {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    let angle = random(TWO_PI);
    this.vel = p5.Vector.fromAngle(angle).mult(random(0.5, 1.5));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    this.type = type;
    this.size = random(5, 10);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 2;
  }

  display() {
    if (this.type === "hot") {
      fill(255, random(100, 150), 0, this.lifespan);
    } else {
      fill(0, 150, 255, this.lifespan);
    }
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}
