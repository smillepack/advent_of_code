import * as fs from "node:fs/promises";

const robotSym = '@';
const wallSym = '#';
const emptySym = '.';

const printMap = (map, before = '') => {
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
    result = result.replaceAll('[]', blue + '[]' + reset)

    return result
  }).join('\n'))
}

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
data.pop();
const map = data.toSpliced(data.indexOf('')).map((row) => {
  let result = row;

  result = result.replaceAll(emptySym, emptySym + emptySym);
  result = result.replaceAll(wallSym, wallSym + wallSym);
  result = result.replaceAll('O', '[]');
  result = result.replaceAll(robotSym, robotSym + emptySym);

  return result.split('');
});
const moves = data.toSpliced(0, data.indexOf('') + 1).join('').split('')

const getNextPosition = ({ x, y }, move) => {
  if (move === '^') return { x, y: y  - 1 };
  else if (move === '>') return { x: x + 1, y };
  else if (move === 'v') return { x, y: y + 1 };
  else if (move === '<') return { x: x - 1, y };
}

const getNextPositions = (positions, move) => {
  let nextPositions = positions.map((objP) => getNextPosition(objP, move))

  if (nextPositions.some(({ x, y }) => '[]#'.includes(map[y][x]))) {
    nextPositions = nextPositions.filter(({ x, y }) => map[y][x] !== emptySym)
  }

  if (!'^v'.includes(move)) return nextPositions;

  const { x: fx, y: fy } = nextPositions.at(0);
  if (map[fy][fx] === ']') {
    nextPositions.unshift({ x: fx - 1, y: fy });
  }

  const { x: lx, y: ly } = nextPositions.at(-1);
  if (map[ly][lx] === '[') {
    nextPositions.push({ x: lx + 1, y: ly });
  }

  return nextPositions;
}

const moveObj = (objectsPositions, move) => {
  const nextPositions = getNextPositions(objectsPositions, move)

  if (nextPositions.some(({ x, y }) => map[y][x] === wallSym)) return false;
  if (nextPositions.some(({ x, y }) => '[]'.includes(map[y][x])) && !moveObj(nextPositions, move)) return false;

  objectsPositions.forEach(({ x: cx, y: cy }) => {
    const objSym = map[cy][cx];
    const { x: nx, y: ny } = getNextPosition({ x: cx, y: cy }, move);
    map[cy][cx] = emptySym;
    map[ny][nx] = objSym;
  })

  return true;
}

printMap(map, 'start')
moves.forEach((move) => {
  const robotY = map.findIndex((row) => row.includes(robotSym))
  const robotPosition = {
    x: map[robotY].indexOf(robotSym),
    y: robotY
  };

  moveObj([robotPosition], move);
  // printMap(map, 'start')
})
printMap(map, 'result')

const result = map.reduce((acc, row, y) => {
  const gpsSum = row.reduce((acc2, item, x) => {
    if (item !== '[') return acc2;

    return acc2 + 100 * y + x
  }, 0)

  return acc + gpsSum;
}, 0)
console.log('answer', result)
