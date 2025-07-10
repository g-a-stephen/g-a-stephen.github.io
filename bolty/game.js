const { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint } = Matter;

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
    wireframes: false
  },
});

Render.run(render);
Engine.run(engine);

// Base bolt object
const baseBolt = Bodies.rectangle(canvas.width / 2, canvas.height - 60, 100, 40, {
  isStatic: true,
  render: { fillStyle: "#555" }
});
World.add(world, baseBolt);

// Mouse controls
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: 0.2 }
});
World.add(world, mouseConstraint);

// Score tracker
let score = 0;
const scoreDisplay = document.getElementById("scoreDisplay");
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Rotation and movement
let currentBody = null;

// Show instructions
const instructions = document.createElement("div");
instructions.innerHTML = `
  <strong>Bolty Balance Controls</strong><br>
  ⬅️➡️ Move object<br>
  ⬆️⬇️ Rotate object<br>
  🖱️ Click icons below to spawn
`;
instructions.style = `
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 14px;
  background: rgba(255,255,255,0.9);
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 0 6px rgba(0,0,0,0.1);
  line-height: 1.4;
`;
document.body.appendChild(instructions);

// Listen for keyboard input
document.addEventListener("keydown", event => {
  if (!currentBody) return;

  const step = 5;

  if (event.key === "ArrowLeft") {
    Body.translate(currentBody, { x: -step, y: 0 });
  } else if (event.key === "ArrowRight") {
    Body.translate(currentBody, { x: step, y: 0 });
  } else if (event.key === "ArrowUp") {
    Body.rotate(currentBody, Math.PI / 36); // clockwise
  } else if (event.key === "ArrowDown") {
    Body.rotate(currentBody, -Math.PI / 36); // counter-clockwise
  }
});

// Object creation
document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    const shape = item.dataset.shape;
    const x = canvas.width / 2;
    const y = 100;
    let newBody;

    const colors = {
      paperclip: "#7f8c8d",
      gear: "#3498db",
      pencil: "#e67e22",
      eraser: "#f1c40f",
      string: "#9b59b6",
      matchstick: "#c0392b",
      gummy: "#ff69b4",
      cord: "#2ecc71"
    };

    switch (shape) {
      case "paperclip":
        newBody = Bodies.rectangle(x, y, 60, 15, { render: { fillStyle: colors[shape] } });
        break;
      case "gear":
        newBody = Bodies.circle(x, y, 25, { render: { fillStyle: colors[shape] } });
        break;
      case "pencil":
        newBody = Bodies.rectangle(x, y, 70, 10, { render: { fillStyle: colors[shape] } });
        break;
      case "eraser":
        newBody = Bodies.rectangle(x, y, 40, 25, { render: { fillStyle: colors[shape] } });
        break;
      case "string":
        newBody = Bodies.rectangle(x, y, 55, 8, { render: { fillStyle: colors[shape] } });
        break;
      case "matchstick":
        newBody = Bodies.rectangle(x, y, 60, 6, { render: { fillStyle: colors[shape] } });
        break;
      case "gummy":
        newBody = Bodies.circle(x, y, 20, { render: { fillStyle: colors[shape] } });
        break;
      case "cord":
        newBody = Bodies.rectangle(x, y, 50, 18, { render: { fillStyle: colors[shape] } });
        break;
    }

    if (newBody) {
      currentBody = newBody;
      World.add(world, newBody);
      score++;
      updateScore();
    }
  });
});
