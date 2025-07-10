const { Engine, Render, World, Bodies, Body, Events, Mouse, MouseConstraint } = Matter;

const engine = Engine.create();
const world = engine.world;

const canvas = document.getElementById("world");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const render = Render.create({
  canvas,
  engine,
  options: {
    width: canvas.width,
    height: canvas.height,
    background: "#e6e6e6",
    wireframes: false,
    showAngleIndicator: false
  },
});

Render.run(render);
Engine.run(engine);

// Create base bolt object
const baseBolt = Bodies.rectangle(canvas.width / 2, canvas.height - 60, 100, 40, {
  isStatic: true,
  render: { fillStyle: "#555" }
});
World.add(world, baseBolt);

// Mouse interaction
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: 0.2 },
});
World.add(world, mouseConstraint);

// Score tracker
let score = 0;
const scoreDisplay = document.getElementById("scoreDisplay");
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Rotation
let currentBody = null;
let spawnTime = Date.now();

document.getElementById("rotateLeft").addEventListener("click", () => {
  if (currentBody) Body.rotate(currentBody, -Math.PI / 18);
});

document.getElementById("rotateRight").addEventListener("click", () => {
  if (currentBody) Body.rotate(currentBody, Math.PI / 18);
});

// Object generator
document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    const shape = item.dataset.shape;
    const x = canvas.width / 2;
    const y = 100;
    let newBody;

    const colors = {
