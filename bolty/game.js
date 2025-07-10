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
  },
});

Render.run(render);
Engine.run(engine);

// Bolt base
const baseBolt = Bodies.rectangle(canvas.width / 2, canvas.height - 60, 100, 40, {
  isStatic: true,
  render: { fillStyle: "#555" }
});
World.add(world, baseBolt);

// Mouse controls
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: 0.2 },
});
World.add(world, mouseConstraint);

// Score tracking
let score = 0;
const scoreDisplay = document.getElementById("scoreDisplay");

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Rotation handling
let currentBody = null;

document.getElementById("rotateLeft").addEventListener("click", () => {
  if (currentBody) Body.rotate(currentBody, -Math.PI / 18);
});

document.getElementById("rotateRight").addEventListener("click", () => {
  if (currentBody) Body.rotate(currentBody, Math.PI / 18);
});

// Item spawner
document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    const shape = item.dataset.shape;
    const x = canvas.width / 2;
    const y = 100;
    let newBody, emoji = item.textContent;

    switch (shape) {
      case "paperclip": newBody = Bodies.rectangle(x, y, 60, 15); break;
      case "gear": newBody = Bodies.circle(x, y, 25); break;
      case "pencil": newBody = Bodies.rectangle(x, y, 70, 10); break;
      case "eraser": newBody = Bodies.rectangle(x, y, 40, 25); break;
      case "string": newBody = Bodies.rectangle(x, y, 55, 8); break;
      case "matchstick": newBody = Bodies.rectangle(x, y, 60, 6); break;
      case "gummy": newBody = Bodies.circle(x, y, 20); break;
      case "cord": newBody = Bodies.rectangle(x, y, 50, 18); break;
    }

    if (newBody) {
      newBody.render.sprite = { text: emoji };
      newBody.label = shape;
      currentBody = newBody;
      World.add(world, newBody);
      score++;
      updateScore();
    }
  });
});

// Collapse detection
Events.on(engine, "afterUpdate", () => {
  if (!currentBody) return;

  const thresholdY = canvas.height - 150;
  if (currentBody.position.y > thresholdY) {
    const message = document.createElement("div");
    message.textContent = "💥 Collapse!";
    message.style = `position: absolute; top: 50%; left: 50%;
                     transform: translate(-50%, -50%); font-size: 36px;
                     background: white; padding: 20px; border-radius: 10px;
                     box-shadow: 0 0 10px #000;`;
    document.body.appendChild(message);
    setTimeout(() => location.reload(), 1500); // restart
  }
});
