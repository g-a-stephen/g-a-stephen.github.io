const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

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

// Create base "squat bolt"
const baseBolt = Bodies.rectangle(canvas.width / 2, canvas.height - 80, 100, 40, {
  isStatic: true,
  render: { fillStyle: "#555" }
});
World.add(world, baseBolt);

// Enable mouse interaction
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: 0.2 },
});
World.add(world, mouseConstraint);

// Object tray logic
document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", () => {
    const shape = item.dataset.shape;
    const x = canvas.width / 2;
    const y = 100;
    let newBody;

    switch (shape) {
      case "rectangle":
        newBody = Bodies.rectangle(x, y, 60, 20, { render: { fillStyle: "#aaa" } });
        break;
      case "circle":
        newBody = Bodies.circle(x, y, 25, { render: { fillStyle: "#888" } });
        break;
      case "triangle":
        newBody = Bodies.polygon(x, y, 3, 30, { render: { fillStyle: "#bbb" } });
        break;
      case "square":
        newBody = Bodies.rectangle(x, y, 40, 40, { render: { fillStyle: "#999" } });
        break;
    }

    if (newBody) {
      World.add(world, newBody);
    }
  });
});
