import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
// const size = 6
// const first = 12;

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const size = 70
const first = 1024;

const data = file.split("\n");
if (data.at(-1) === '') data.pop();
// console.log(data)

const coords = data.map((coords) => coords.split(',').map((c) => parseInt(c)));
const map = Array(size + 1).fill(null).map(() => Array(size + 1).fill(Infinity));

coords.forEach(([x, y], index) => {
  if (index >= first) return;
  map[y][x] = '#';
})

const startX = 0;
const startY = 0;
const endX = size;
const endY = size;

const getNextPosition = ({ x, y }, direction) => {
  if (direction === 0) return { x, y: y - 1 };
  else if (direction === 90) return { x: x + 1, y };
  else if (direction === 180) return { x, y: y + 1 };
  else if (direction === 270) return { x: x - 1, y };
}

const getPosibilePositions = (position) => {
  return [
    getNextPosition(position, 0),
    getNextPosition(position, 90),
    getNextPosition(position, 180),
    getNextPosition(position, 270)
  ];
}

(function move({ x, y }, score) {
  if (score >= map[y][x]) return;
  map[y][x] = score;

  const possiblePositions = getPosibilePositions({ x, y });
  possiblePositions.forEach((p) => {
    if (p.x < 0 || p.x > size || p.y < 0 || p.y > size) return;
    if (map[p.y][p.x] === '#') return;
    move(p, score + 1);
  })
})({ x: startX, y: startY }, 0);

console.log('\nresult', map[endY][endX]);
