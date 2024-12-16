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

const getNextPosition = ({ x, y }, move) => {
  if (move === '^') return { x, y: y  - 1 };
  else if (move === '>') return { x: x + 1, y };
  else if (move === 'v') return { x, y: y + 1 };
  else if (move === '<') return { x: x - 1, y };
}

const moveObj = ({ x, y }, move) => {
  const { x: nx, y: ny } = getNextPosition({ x, y }, move)

  if (map[ny][nx] === wallSym) return false;
  if (map[ny][nx] === boxSym && !moveObj({ x: nx, y: ny }, move)) return false;

  const objSym = map[y][x]
  map[y][x] = emptySym
  map[ny][nx] = objSym;

  return nObj;
}

printMap(map, 'start')

const robotY = map.findIndex((row) => row.includes(robotSym))
const robotPosition = {
  x: map[robotY].indexOf(robotSym),
  y: robotY
};

moves.forEach((move, index) => {
  const moved = moveObj(robotPosition, move);

  if (moved) {
    robotPosition.x = moved.x;
    robotPosition.y = moved.y;
  }

  if (index < 70) {
    printMap(map, 'move ' + move + index)
  }
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
