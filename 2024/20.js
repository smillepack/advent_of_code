import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const map = file.split("\n").map((row) => row.split('').map((cell) => {
  if (cell === '.') return Infinity;

  return cell;
}));
if (map.at(-1) === '') data.pop();

const start = 'S';
const end = 'E';
const wall = '#';

const startY = map.findIndex((row) => row.includes(start));
const startX = map[startY].indexOf(start);
const endY = map.findIndex((row) => row.includes(end));
const endX = map[endY].indexOf(end);
const mapWidth = map[0].length;
const mapHeight = map.length;

const getRadiusCoords = (r) => {
  const coords = new Set();

  for (let i = 0; i <= r; i++) {
    coords.add(`x:${i}|y:${r - i}`);
    coords.add(`x:${i}|y:${i - r}`);
    coords.add(`x:${-i}|y:${r - i}`);
    coords.add(`x:${-i}|y:${i - r}`);
  }

  return [...coords].map((str) => {
    const [x, y] = str.match(/-*\d+/g);

    return { x: parseInt(x), y: parseInt(y) };
  });
};

const getRadiuses = (r) => {
  const radiuses = new Map();

  for (let i = r; i >= 1; i--) {
    radiuses.set(i, getRadiusCoords(i));
  }

  return radiuses;
};

const d1 = getRadiusCoords(1);
const dr20 = getRadiuses(20);

const move = (sx, sy, map) => {
  let score = 0;
  let moves = [{ x: sx, y: sy }];

  while (moves.length) {
    moves = moves.flatMap(({ x, y }) => {
      map[y][x] = score;

      return d1.map(({ x: dx, y: dy }) => {
        const nx = x + dx;
        const ny = y + dy;
  
        if (nx < 0 || nx === mapWidth - 1 || ny < 0 || ny === mapHeight - 1) return;
        if (map[ny][nx] === wall) return;
        if (map[ny][nx] <= score) return;
  
        return { x: nx, y: ny };
      });
    }).filter(Boolean);

    score++;
  }
};
move(startX, startY, map);
// console.log("end", map[endY][endX]);

const times = new Map();
const moveGhosty = (sx, sy, map) => {
  let score = 0;
  const moves = [{ x: sx, y: sy }];

  while (moves.length) {
    const { x, y } = moves.shift();

    d1.forEach(({ x: dx, y: dy }) => {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || nx === mapWidth - 1 || ny < 0 || ny === mapHeight - 1) return;
      if (map[ny][nx] === wall) return;
      if (map[ny][nx] <= score) return;

      moves.push({ x: nx, y: ny });
    });

    dr20.forEach((coords, r) => {
      coords.forEach(({ x: dx, y: dy }) => {
        const rx = x + dx;
        const ry = y + dy;

        if (rx < 0 || rx >= mapWidth - 1 || ry < 0 || ry >= mapHeight - 1) return;
        if (map[ry][rx] === wall) return;
        if (map[ry][rx] < score + r) return;

        const best = map[ry][rx] - score - r;
        if (times.has(best)) {
          times.set(best, times.get(best) + 1);
        } else {
          times.set(best, 1);
        }
      })
    });

    score++;
  }
};
moveGhosty(startX, startY, map);

const result = [...times.entries()].reduce((acc, [key, value]) => {
  return key < 100 ? acc :acc + value;
},0);
console.log('result', result)
