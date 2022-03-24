function initAngles(GRID_SIZE) {
  noiseSeed(99);
  const angles = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    angles.push([]);
    for (let j = 0; j < GRID_SIZE; j++) {
      angles[i].push(noise(i * 0.01, j * 0.01) * 2 * PI);
    }
  }

  return angles;
}

function drawField(angles, GRID_SIZE, RESOLUTION) {
  const MIN = 0;
  const MAX = GRID_SIZE;

  for (let i = MIN; i < MAX; i++) {
    for (let j = MIN; j < MAX; j++) {
      const angle = angles[i][j];
      let x = (i - MIN) / RESOLUTION;
      let y = (j - MIN) / RESOLUTION;

      push();
      translate(x, y);
      rotate(angle);
      fill("#E8BFFB50");
      noStroke();
      triangle(0, -10, 4, 4, -4, 4);
      pop();
    }
  }
}

function drawCurve(angles, x, y, STEP_LENGTH, GRID_SIZE, RESOLUTION, width) {
  const MIN = Math.floor(GRID_SIZE / 4);
  if (!width) width = 2;

  beginShape();
  noFill();
  strokeWeight(width);
  stroke(
    color(`hsb(270, ${(100 * (y - 50)) / (GRID_SIZE / RESOLUTION / 2)}%, 59%)`)
  );
  curveVertex(x, y);
  for (let step = 0; step < 5000; step++) {
    // find our place in our angles grid
    const angleX = Math.round(x * RESOLUTION) + MIN;
    const angleY = Math.round(y * RESOLUTION) + MIN;

    if (angleX >= GRID_SIZE || angleY >= GRID_SIZE || angleX < 0 || angleY < 0)
      break;
    const angle = angles[angleX][angleY];

    // move via angle
    x += STEP_LENGTH * Math.sin(angle);
    y -= STEP_LENGTH * Math.cos(angle);

    curveVertex(x, y);
  }
  endShape();
}

function drawBoxCurve(angles, x, y, STEP_LENGTH, GRID_SIZE, RESOLUTION) {
  const MIN = Math.floor(GRID_SIZE / 4);

  const yp = y / (GRID_SIZE / RESOLUTION / 2);
  for (let step = 0; step < 5000; step++) {
    // find our place in our angles grid
    const angleX = Math.round(x * RESOLUTION) + MIN;
    const angleY = Math.round(y * RESOLUTION) + MIN;

    if (angleX >= GRID_SIZE || angleY >= GRID_SIZE || angleX < 0 || angleY < 0)
      break;
    const angle = angles[angleX][angleY];

    // move via angle
    x += STEP_LENGTH * Math.sin(angle);
    y -= STEP_LENGTH * Math.cos(angle);

    push();
    translate(x, y);
    rotate(angle);
    fill(color(`hsba(${Math.floor(yp * 255)}, 40%, 80%, 0.5)`));
    noStroke();
    square(0, 0, STEP_LENGTH, STEP_LENGTH / 4);
    pop();
  }
}

function drawPenCurve(angles, x, y, STEP_LENGTH, GRID_SIZE, RESOLUTION) {
  const MIN = Math.floor(GRID_SIZE / 4);

  for (let step = 0; step < 5000; step++) {
    const full = GRID_SIZE / RESOLUTION / 2;
    const n1 = noise(x, y);
    const n2 = noise(x + full, y + full);
    const n3 = noise(x + 2 * full, y + 2 * full);

    const currentStep = n1 * STEP_LENGTH;

    // find our place in our angles grid
    const angleX = Math.round(x * RESOLUTION) + MIN;
    const angleY = Math.round(y * RESOLUTION) + MIN;

    if (angleX >= GRID_SIZE || angleY >= GRID_SIZE || angleX < 0 || angleY < 0)
      break;
    const angle = angles[angleX][angleY];

    // move via angle
    x += currentStep * Math.sin(angle);
    y -= currentStep * Math.cos(angle);

    push();
    translate(x, y);
    fill("black");
    rotate(angle + n2 - 0.5);
    noStroke();
    square(-currentStep / 2 + n3, -currentStep / 2, currentStep + 1);
    pop();
  }
}

function packCurve(angles, MAX_STEP, GRID_SIZE, RESOLUTION) {
  const w = MAX_STEP;
  let buffer = 10;
  let margin = 3;
  const FULL = GRID_SIZE / RESOLUTION;

  randomSeed(99);

  const circles = [];
  for (let i = 0; i < 1000; i++) {
    let x = random(FULL);
    let y = random(FULL);
    const width = Math.random() * w + 10;
    const pathCircles = [];
    const vertices = [];

    while (true) {
      // find our place in our angles grid
      const angleX = Math.round(x * RESOLUTION);
      const angleY = Math.round(y * RESOLUTION);
      const n1 = noise(x * 0.01, y * 0.01);
      const currentStep = n1 * width;

      if (
        angleX >= GRID_SIZE - margin ||
        angleY >= GRID_SIZE - margin ||
        angleX < margin ||
        angleY < margin ||
        circles.some(
          (circle) =>
            dist(x, y, circle[0], circle[1]) <= (circle[2] + width + buffer) / 2
        )
      )
        break;
      const angle = angles[angleX][angleY];
      const ox = Math.sin(angle) * currentStep;
      const oy = -Math.cos(angle) * currentStep;

      vertices.push([x, y, ox, oy]);
      pathCircles.push([x, y, width]);

      // move via angle
      x += ox;
      y -= oy;
    }
    circles.push(...pathCircles);

    beginShape();
    fill(color(`hsb(270, ${Math.floor(Math.random() * 100)}%, 59%)`));
    noStroke();

    for (const n in vertices) {
      const x = vertices[n][0] + vertices[n][3] / 2;
      const y = vertices[n][1] + vertices[n][2] / 2;
      curveVertex(x, y);
    }

    for (const n in vertices.reverse()) {
      const x = vertices[n][0] - vertices[n][3] / 2;
      const y = vertices[n][1] - vertices[n][2] / 2;
      curveVertex(x, y);
    }

    endShape(CLOSE);
  }
}
