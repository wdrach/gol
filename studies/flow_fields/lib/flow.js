function initAngles(GRID_SIZE) {
  const angles = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    angles.push([]);
    for (let j = 0; j < GRID_SIZE; j++) {
      angles[i].push(noise(i * 0.05, j * 0.05) * 2 * PI);
    }
  }

  return angles;
}

function drawField(angles, GRID_SIZE, RESOLUTION) {
  const MIN = Math.floor(GRID_SIZE / 4);
  const MAX = GRID_SIZE - MIN;

  for (let i = MIN; i < MAX; i++) {
    for (let j = MIN; j < MAX; j++) {
      const angle = angles[i][j];
      let x = (i - MIN) / RESOLUTION;
      let y = (j - MIN) / RESOLUTION;

      push();
      translate(x, y);
      rotate(angle);
      fill("#E8BFFB");
      noStroke();
      triangle(0, -10, 4, 4, -4, 4);
      pop();
    }
  }
}

function drawCurve(angles, x, y, STEP_LENGTH, GRID_SIZE, RESOLUTION) {
  const MIN = Math.floor(GRID_SIZE / 4);

  beginShape();
  noFill();
  strokeWeight(2);
  stroke(
    color(`hsb(270, ${(100 * (y - 50)) / (GRID_SIZE / RESOLUTION / 2)}%, 59%)`)
  );
  curveVertex(x, y);
  for (let step = 0; step < 500; step++) {
    // find our place in our angles grid
    const angleX = Math.round(x * RESOLUTION) + MIN;
    const angleY = Math.round(y * RESOLUTION) + MIN;

    if (angleX >= GRID_SIZE || angleY >= GRID_SIZE || angleX < 0 || angleY < 0)
      break;
    const angle = angles[angleX][angleY];
    if (step === 0) {
      console.log(angle);
    }

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
  for (let step = 0; step < 200; step++) {
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
