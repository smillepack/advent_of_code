import * as fs from "node:fs/promises";

const printMap = (map, before) => {
  const magenta = '\x1b[35m'
  const red = '\x1b[31m';
  const green = '\x1b[32m';
  const blue = '\x1b[34m'
  const reset = '\x1b[0m';

  console.log('\n', magenta + before + reset)

  console.log(map.map((row) => {
    let result = row.join('')

    result = result.replaceAll(robotSym, red + robotSym + reset)
    result = result.replaceAll(wallSym, green + wallSym + reset)
    result = result.replaceAll(boxSym, blue + boxSym + reset)

    return result
  }).join('\n'))
}

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
data.pop();
const map = data.toSpliced(data.indexOf('')).map((row) => row.split(''));
const moves = data.toSpliced(0, data.indexOf('') + 1).join('').split('')
// console.log(map)
// console.log(moves)

const robotSym = '@';
const boxSym = 'O';
const wallSym = '#';
const emptySym = '.';
const wallThickness = 1;
const mapWidth = map[0].length;

const getNextPosition = ({ x, y }, move) => {
  const up = Math.max(wallThickness, y  - 1)
  const right = Math.min(mapWidth - wallThickness - 1, x + 1)
  const down = Math.min(mapWidth - wallThickness - 1, y + 1)
  const left = Math.max(wallThickness, x - 1)

  if (move === '^') return { x, y: up };
  else if (move === '>') return { x: right, y };
  else if (move === 'v') return { x, y: down };
  else if (move === '<') return { x: left, y };
}

const moveObj = (obj, move) => {
  const { x, y } = obj
  const nObj = getNextPosition({ x, y }, move)
  const { x: nx, y: ny } = nObj
  const nextPObj = map[ny][nx]
  const char = map[y][x]

  if (nx === x && ny === y) return false;
  if (nextPObj === wallSym) return false;
  if (nextPObj === boxSym && !moveObj({ x: nx, y: ny }, move)) return false;

  map[y][x] = emptySym
  map[ny][nx] = char;

  return nObj;
}

printMap(map, 'start')

const robotY = map.findIndex((row) => row.includes(robotSym))
const robotPosition = {
  x: map[robotY].indexOf(robotSym),
  y: robotY
};

moves.forEach((move) => {
  const moved = moveObj(robotPosition, move);

  if (moved) {
    robotPosition.x = moved.x;
    robotPosition.y = moved.y;
  }

  // printMap(map, 'move ' + move)
})

printMap(map, 'result')

const result = map.reduce((acc, row, y) => {
  const gpsSum = row.reduce((acc2, item, x) => {
    if (item !== boxSym) return acc2;

    return acc2 + 100 * y + x
  }, 0)

  return acc + gpsSum;
}, 0)
console.log('answer', result)
