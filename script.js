const flowerPositions = [];
const start = document.getElementById("start");
const svg = document.getElementById("canvas");
const music = document.getElementById("music");

start.addEventListener("click", function() {

    // Fade out start screen
    start.style.opacity = "0";

    music.loop = true
    music.play();

    setTimeout(() => {

        start.style.display = "none";

        const canvas = document.getElementById("canvas");

        // Munculkan canvas
        canvas.style.opacity = "1";

        // Hapus blur perlahan
        setTimeout(() => {
            canvas.style.filter = "blur(0px)";
        }, 200);

        generateRandomFlowers();

        // Show center text (quote) after flowers are generated
        const center = document.getElementById("centerText");
        if (center) {
            center.style.opacity = "1";
            center.style.filter = "blur(0px)";
        }

    }, 1500);
});


function drawFlower(x, y, s = 1) {

    // 1️⃣ buat group bunga
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "flower-group");
    svg.appendChild(group);

    // 2️⃣ JUMLAH KELOPAK (INI YANG KAMU CARI)
    const petalCount = 6; // ubah jadi 8 kalau mau lebih penuh

    // 3️⃣ loop untuk bikin kelopak FULL
    for (let i = 0; i < petalCount; i++) {

        const angle = (360 / petalCount) * i;

        const petal = document.createElementNS("http://www.w3.org/2000/svg", "path");

        petal.setAttribute("d",
            `M ${x} ${y}
             q 0 ${-40 * s} ${20 * s} ${-60 * s}
             q ${-20 * s} ${40 * s} 0 ${60 * s}`
        );

        petal.setAttribute("stroke", "white");
        petal.setAttribute("fill", randomColor());
        petal.setAttribute("stroke-width", "1");

        petal.setAttribute(
            "transform",
            `rotate(${angle} ${x} ${y})`
        );

        group.appendChild(petal);
        animateDrawing(petal);
    }

    // 4️⃣ tangkai
    const stem = document.createElementNS("http://www.w3.org/2000/svg", "path");
    stem.setAttribute("d", `M ${x} ${y} Q ${x + 5 * s} ${y + 40 * s} ${x} ${y + 80 * s}`);
    stem.setAttribute("stroke", "#427A43"); // hijau natural
    stem.setAttribute("stroke-width", "3");
    stem.setAttribute("fill", "none");

    group.appendChild(stem);

    const leafLeft = document.createElementNS("http://www.w3.org/2000/svg", "path");

leafLeft.setAttribute("d",
    `M ${x} ${y + 40 * s}
     q ${-30 * s} ${-10 * s} ${-40 * s} ${20 * s}
     q ${20 * s} ${10 * s} ${40 * s} ${-20 * s}`
);

leafLeft.setAttribute("fill", "#BCD9A2");
leafLeft.setAttribute("stroke", "#2e8b57");
leafLeft.setAttribute("stroke-width", "1");

group.appendChild(leafLeft);

const leafRight = document.createElementNS("http://www.w3.org/2000/svg", "path");

leafRight.setAttribute("d",
    `M ${x} ${y + 55 * s}
     q ${30 * s} ${-10 * s} ${40 * s} ${20 * s}
     q ${-20 * s} ${10 * s} ${-40 * s} ${-20 * s}`
);

leafRight.setAttribute("fill", "#B8DB80");
leafRight.setAttribute("stroke", "#2e8b57");
leafRight.setAttribute("stroke-width", "1");

group.appendChild(leafRight);

    const randomOffset = Math.random() * 10;

    // Slight random scale transform on the whole group for natural look
    const wobble = 0.98 + Math.random() * 0.04;
    group.style.transform = `scale(${wobble})`;

}


function animateDrawing(path) {

    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    path.getBoundingClientRect();

    path.style.transition = "stroke-dashoffset 2s ease";

    path.style.strokeDashoffset = "0";
}


function createPetal(group, d) {

    const colors = ["#ffb6c1", "#ffc0cb", "#ffd1dc", "#fff0f5", "#ff69b4"];

    const petal = document.createElementNS("http://www.w3.org/2000/svg", "path");

    petal.setAttribute("d", d);
    petal.setAttribute("stroke", colors[Math.floor(Math.random() * colors.length)]);
    petal.setAttribute("fill", "none");
    petal.setAttribute("stroke-width", "2");

    group.appendChild(petal);
    animateDrawing(petal);
    
}



function generateRandomFlowers() {

    // Clear previous flowers
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    flowerPositions.length = 0;

    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const vbW = vb.width || 800;
    const vbH = vb.height || 500;

    // Determine count based on viewport area (density tweakable)
    const area = rect.width * rect.height;
    // Reduce density: fewer flowers per area so they don't feel cramped
    let count = Math.round(area / 45000); // ~1 flower per 45k px
    count = Math.max(10, Math.min(count, 180));

    const marginPx = Math.max(16, rect.width * 0.03);
    // Increase minimum spacing so flowers don't overlap on larger screens
    const minDistancePx = Math.max(36, rect.width / 12);

    for (let i = 0; i < count; i++) {

        let xPx, yPx;
        let validPosition = false;
        let attempts = 0;

        while (!validPosition && attempts < 300) {

            xPx = marginPx + Math.random() * (rect.width - marginPx * 2);
            yPx = marginPx + Math.random() * (rect.height - marginPx * 2);

            validPosition = true;

            for (let pos of flowerPositions) {
                const dx = pos.x - xPx;
                const dy = pos.y - yPx;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistancePx) {
                    validPosition = false;
                    break;
                }
            }

            attempts++;
        }

        if (validPosition) {
            // Convert pixel coordinates to viewBox coordinates
            const xVb = (xPx / rect.width) * vbW;
            const yVb = (yPx / rect.height) * vbH;

            flowerPositions.push({ x: xPx, y: yPx });
            // scale based on viewport and small randomness
            const baseScale = Math.min(1.2, Math.max(0.6, rect.width / 1000));
            const scale = baseScale * (0.7 + Math.random() * 0.8);
            drawFlower(xVb, yVb, scale);
        }
    }
}

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


// debounce helper to avoid excessive regeneration on resize
function debounce(fn, delay = 200) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

// Regenerate flowers on resize/orientation change when canvas is visible
window.addEventListener('resize', debounce(() => {
    const startElem = document.getElementById('start');
    const canvasVisible = startElem && startElem.style.display === 'none';
    if (canvasVisible) generateRandomFlowers();
}, 250));


