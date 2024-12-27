import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

const map = file.split("\n").map((row) => row.split(''));
if (map.at(-1) === '') map.pop();

const getNextPosition = ({ x, y }, direction) => {
  if (direction === 0) return { x, y: y - 1 };
  else if (direction === 90) return { x: x + 1, y };
  else if (direction === 180) return { x, y: y + 1 };
  else if (direction === 270) return { x: x - 1, y };
}

const getPossiblePositions = (position, direction) => {
  const counterclockwiseD = (direction - 90 + 360) % 360;
  const clockwiseD = (direction + 90) % 360;

  return [{
    ...getNextPosition(position, counterclockwiseD),
    direction: counterclockwiseD
  }, {
    ...getNextPosition(position, direction),
    direction
  }, {
    ...getNextPosition(position, clockwiseD),
    direction: clockwiseD
  }];
}

const sy = map.findIndex((row) => row.includes('S'));
const sx = map[sy].findIndex((cell) => cell === 'S');

const ey = map.findIndex((row) => row.includes('E'));
const ex = map[ey].findIndex((cell) => cell === 'E');

(function move(cx, cy, direction, score) {
  if (score > map[ey][ex]) return;
  if (score >= map[cy][cx]) return;

  map[cy][cx] = score;

  const possiblePositions = getPossiblePositions({ x: cx, y: cy }, direction);
  possiblePositions.forEach(({ x, y, direction: pd }) => {
    if (map[y][x] === '#') return;
    if (score >= map[y][x]) return;

    move(x, y, pd, pd !== direction ? score + 1001 : score + 1);
  });
})(sx, sy, 90, 0);

console.log('result =', map[ey][ex])