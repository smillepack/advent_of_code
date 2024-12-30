import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

const map = file.split("\n").map((row) => row.split('').map((cell) => new Map([['directions', new Map()], ['value', cell]])));
if (map.at(-1) === '') map.pop();

const positionsAround = [
  {
    dx: 1,
    dy: 0,
    direction: 90
  }, {
    dx: -1,
    dy: 0,
    direction: 270
  }, {
    dx: 0,
    dy: 1,
    direction: 180
  }, {
    dx: 0,
    dy: -1,
    direction: 0
  }
]

const sy = map.findIndex((row) => row.find((el) => el.get('value') === 'S'));
const sx = map[sy].findIndex((cell) => cell.get('value') === 'S');

const ey = map.findIndex((row) => row.find((el) => el.get('value') === 'E'));
const ex = map[ey].findIndex((cell) => cell.get('value') === 'E');

(function move(cx, cy, cd, cs) {
  if (cs > map[ey][ex].get('directions').get(0)) return;
  if (cs > map[ey][ex].get('directions').get(90)) return;
  if (cs > map[ey][ex].get('directions').get(180)) return;
  if (cs > map[ey][ex].get('directions').get(270)) return;
  if (map[cy][cx].get('directions').get(cd) <= cs) return;

  map[cy][cx].get('directions').set(cd, cs);

  const pp = positionsAround.filter(({ direction }) => direction !== (cd + 180) % 360);
  pp.forEach(({ dx, dy, direction: dd }) => {
    const x = cx + dx;
    const y = cy + dy;

    if (map[y][x].get('value') === '#') return;
    if (map[y][x].get('directions').get(dd) <= cs) return;

    if (dd !== cd) {
      move(cx, cy, dd, cs + 1000);
    } else {
      move(x, y, dd, cs + 1);
    }
  });
})(sx, sy, 90, 0, [{ x: sx, y: sy }]);
console.log('end', map[ey][ex])

const bestSeats = new Set();
(function move(cx, cy, cd, cs, path) {
  if (cs > map[ey][ex].get('directions').get(0)) return;
  if (cs > map[ey][ex].get('directions').get(90)) return;
  if (cs > map[ey][ex].get('directions').get(180)) return;
  if (cs > map[ey][ex].get('directions').get(270)) return;

  if (cx === ex && cy === ey) {
    path.forEach(({ x, y }) => bestSeats.add(`x:${x}|y:${y}`));
    return;
  }

  positionsAround.filter(({ direction }) => direction !== (cd + 180) % 360).forEach(({ dx, dy, direction: dd }) => {
    const x = cx + dx;
    const y = cy + dy;

    if (map[y][x].get('value') === '#') return;
    if (map[y][x].get('directions').get(dd) < cs) return;

    if (dd !== cd) {
      move(cx, cy, dd, cs + 1000, [...path]);
    } else {
      move(x, y, dd, cs + 1, [...path, { x, y }]);
    }
  });
})(sx, sy, 90, 0, [{ x: sx, y: sy }]);
console.log('bestSeats', bestSeats.size)
