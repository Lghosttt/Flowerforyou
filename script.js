const svg = document.getElementById("canvas");
const start = document.getElementById("start");
const music = document.getElementById("music");
const text = document.getElementById("centerText");

// START CLICK
start.addEventListener("click", () => {
  start.style.opacity = "0";
  music.play();

  setTimeout(() => {
    start.style.display = "none";
    svg.style.opacity = "1";
    svg.style.filter = "blur(0px)";
    generateFlowers();
  }, 1500);

  setTimeout(() => {
    text.style.opacity = "1";
    text.style.filter = "blur(0px)";
  }, 4500);
});

// FLOWER GENERATION
function generateFlowers() {
  const area = window.innerWidth * window.innerHeight;
  const flowerCount = Math.floor(area / 12000);

  for (let i = 0; i < flowerCount; i++) {
    setTimeout(() => {
      const padding = 80;
      const x = padding + Math.random() * (window.innerWidth - padding * 2);
      const y = padding + Math.random() * (window.innerHeight - padding * 2);
      drawFlower(x, y);
    }, i * 200);
  }
}

// DRAW FLOWER
function drawFlower(x, y) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.classList.add("flower");
  svg.appendChild(group);

  const petalCount = 6;

  for (let i = 0; i < petalCount; i++) {
    const angle = (360 / petalCount) * i;

    const petal = document.createElementNS("http://www.w3.org/2000/svg", "path");
    petal.setAttribute("d", `
      M ${x} ${y}
      q 0 -35 20 -55
      q -20 35 0 55
    `);

    petal.setAttribute("fill", randomColor());
    petal.setAttribute("stroke", "white");
    petal.setAttribute("stroke-width", "1");
    petal.setAttribute("transform", `rotate(${angle} ${x} ${y})`);

    group.appendChild(petal);
  }

  // STEM
  const stem = document.createElementNS("http://www.w3.org/2000/svg", "path");
  stem.setAttribute("d", `M ${x} ${y} Q ${x+5} ${y+50} ${x} ${y+90}`);
  stem.setAttribute("stroke", "#2e8b57");
  stem.setAttribute("stroke-width", "3");
  stem.setAttribute("fill", "none");
  group.appendChild(stem);

  // LEAVES
  createLeaf(group, x, y + 45, -1);
  createLeaf(group, x, y + 60, 1);
}

// LEAF
function createLeaf(group, x, y, dir) {
  const leaf = document.createElementNS("http://www.w3.org/2000/svg", "path");
  leaf.setAttribute("d", `
    M ${x} ${y}
    q ${30 * dir} -10 ${40 * dir} 20
    q ${-20 * dir} 10 ${-40 * dir} -20
  `);
  leaf.setAttribute("fill", "#3cb371");
  leaf.setAttribute("stroke", "#2e8b57");
  leaf.setAttribute("stroke-width", "1");
  group.appendChild(leaf);
}

// COLOR
function randomColor() {
  const colors = [
    "#ffb6c1",
    "#ffc0cb",
    "#ff69b4",
    "#ffd1dc",
    "#ffa6c9"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
