function initMatrix(SIM_DEPTH, SEED_DEPTH, FULL_SIZE) {
  const matrix = [];

  for (let i = 0; i < SIM_DEPTH; i++) {
    // 1 for each color
    matrix.push([]);

    for (let j = 0; j < FULL_SIZE; j++) {
      matrix[i].push([]);

      for (let k = 0; k < FULL_SIZE; k++) {
        matrix[i][j].push(Math.floor(Math.random() * SEED_DEPTH) === 0 ? 1 : 0);
      }
    }
  }

  return matrix;
}

function tickMatrix(matrix, SIM_DEPTH, FULL_SIZE) {
  for (let ci = 0; ci < SIM_DEPTH; ci++) {
    const newMatrix = [];
    for (let i = 0; i < FULL_SIZE; i++) {
      newMatrix.push([]);
      for (let j = 0; j < FULL_SIZE; j++) {
        const cell = matrix[ci][i][j];

        let up = j - 1;
        let down = j + 1;
        let left = i - 1;
        let right = i + 1;

        if (up === -1) up = FULL_SIZE - 1;
        else if (down === FULL_SIZE) down = 0;

        if (left === -1) left = FULL_SIZE - 1;
        else if (right === FULL_SIZE) right = 0;

        let count = 0;
        if (matrix[ci][left][up]) count++;
        if (matrix[ci][i][up]) count++;
        if (matrix[ci][right][up]) count++;
        if (matrix[ci][left][j]) count++;
        if (matrix[ci][right][j]) count++;
        if (matrix[ci][left][down]) count++;
        if (matrix[ci][i][down]) count++;
        if (matrix[ci][right][down]) count++;

        if (count < 2) newMatrix[i].push(0);
        else if (count > 3) newMatrix[i].push(0);
        else if (count === 3) newMatrix[i].push(1);
        else newMatrix[i].push(cell);
      }
    }

    matrix[ci] = newMatrix;
  }

  return matrix;
}
