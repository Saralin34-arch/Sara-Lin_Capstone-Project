// Air Leaking Demo - Based on p5.js Smoke Particle System
let particles = [];
let building;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('canvas-container');
  
  // Create building object
  building = {
    x: width / 2,
    y: height / 2,
    w: 200,
    h: 200,
    color: color(80, 80, 80, 200)
  };
}

function draw() {
  // Create semi-transparent background for trail effect
  background(240, 240, 240, 20);
  
  // Draw building
  drawBuilding();
  
  // Emit particles from building edges
  emitParticles();
  
  // Update and display particles
  updateParticles();
  
  // Add some text overlay
  drawOverlay();
}

function drawBuilding() {
  push();
  fill(building.color);
  stroke(60, 60, 60);
  strokeWeight(2);
  rectMode(CENTER);
  rect(building.x, building.y, building.w, building.h);
  
  // Add some building details
  fill(100, 100, 100);
  noStroke();
  // Windows
  rect(building.x - 40, building.y - 60, 20, 20);
  rect(building.x + 40, building.y - 60, 20, 20);
  rect(building.x - 40, building.y + 60, 20, 20);
  rect(building.x + 40, building.y + 60, 20, 20);
  pop();
}

function emitParticles() {
  // Define leak points around the building
  let leakPoints = [
    // Top edge - hot air escaping
    { x: building.x + random(-building.w/2 + 20, building.w/2 - 20), 
      y: building.y - building.h/2, 
      type: 'hot', 
      angle: random(-PI/4, PI/4) },
    
    // Bottom edge - cool air escaping  
    { x: building.x + random(-building.w/2 + 20, building.w/2 - 20), 
      y: building.y + building.h/2, 
      type: 'cool', 
      angle: random(PI - PI/4, PI + PI/4) },
    
    // Left edge - cool air escaping
    { x: building.x - building.w/2, 
      y: building.y + random(-building.h/2 + 20, building.h/2 - 20), 
      type: 'cool', 
      angle: random(PI/2 - PI/4, PI/2 + PI/4) },
    
    // Right edge - hot air escaping
    { x: building.x + building.w/2, 
      y: building.y + random(-building.h/2 + 20, building.h/2 - 20), 
      type: 'hot', 
      angle: random(-PI/2 - PI/4, -PI/2 + PI/4) }
  ];
  
  // Create particles at leak points
  for (let point of leakPoints) {
    if (random() < 0.3) { // 30% chance to emit particle
      particles.push(new Particle(point.x, point.y, point.type, point.angle));
    }
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    
    // Remove dead particles
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
}

function drawOverlay() {
  push();
  fill(255, 255, 255, 200);
  noStroke();
  rect(10, 10, 200, 80);
  
  fill(0);
  textSize(12);
  textAlign(LEFT);
  text('Hot Air (Red/Orange)', 20, 30);
  text('Cool Air (Blue)', 20, 50);
  text('Particles: ' + particles.length, 20, 70);
  pop();
}

class Particle {
  constructor(x, y, type, angle) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    this.type = type;
    this.size = random(3, 8);
    
    // Add some randomness to velocity
    this.vel.add(createVector(random(-0.5, 0.5), random(-0.5, 0.5)));
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 2;
    
    // Add some wind effect
    this.applyForce(createVector(random(-0.1, 0.1), random(-0.1, 0.1)));
  }
  
  display() {
    push();
    noStroke();
    
    if (this.type === 'hot') {
      // Hot air particles - red to orange
      let r = 255;
      let g = random(100, 200);
      let b = 0;
      fill(r, g, b, this.lifespan * 0.8);
    } else {
      // Cool air particles - blue to cyan
      let r = 0;
      let g = random(150, 255);
      let b = 255;
      fill(r, g, b, this.lifespan * 0.8);
    }
    
    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  }
  
  isDead() {
    return this.lifespan < 0;
  }
} 