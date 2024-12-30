import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

const map = file.split("\n").map((row) => row.split(''));
if (map.at(-1) === '') map.pop();

const positionsAround = [
  {
    dx: 1,
    dy: 0,
    dd: 90
  }, {
    dx: -1,
    dy: 0,
    dd: 270
  }, {
    dx: 0,
    dy: 1,
    dd: 180
  }, {
    dx: 0,
    dy: -1,
    dd: 0
  }
];
const sy = map.findIndex((row) => row.includes('S'));
const sx = map[sy].findIndex((cell) => cell === 'S');

const ey = map.findIndex((row) => row.includes('E'));
const ex = map[ey].findIndex((cell) => cell === 'E');

(function move(cx, cy, cd, score) {
  if (score > map[ey][ex]) return;
  if (score >= map[cy][cx]) return;

  map[cy][cx] = score;

  positionsAround.filter(({ dd }) => dd !== (cd + 180) % 360).forEach(({ dx, dy, dd }) => {
    if (map[cy + dy][cx + dx] === '#') return;
    if (map[cy + dy][cx + dx] <= score) return;

    move(cx + dx, cy + dy, dd, dd !== cd ? score + 1001 : score + 1);
  });
})(sx, sy, 90, 0);
console.log('result =', map[ey][ex])
