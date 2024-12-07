import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

const convertedFile = file.split("\n");
convertedFile.pop();
const data = convertedFile.map((row) => row.split(''))
// console.log(data);

// helper
const strConverter = ({ x, y, direction }) => `y:${y}|x:${x}|d:${direction}`
const getNextPosition = (input, hero) => {
  let x = hero.x;
  let y = hero.y;

  if (input === "^") {
    y--;
  } else if (input === "v") {
    y++;
  } else if (input === "<") {
    x--;
  } else if (input === ">") {
    x++;
  }

  return {
    x,
    y,
  };
};

const getNextDirection = (current) => {
  const guardDirections = ['^', '>', 'v', '<']
  const index = guardDirections.indexOf(current)

  return guardDirections[index === guardDirections.length - 1 ? 0 : index + 1]
}

const walk = (data, hero, onIteraction = () => {}) => {
  while (data[hero.y]?.[hero.x]) {
    const { x, y } = getNextPosition(hero.direction, hero)

    if (data[y]?.[x] === '#') {
      hero.direction = getNextDirection(hero.direction)
    } else {
      hero.x = x;
      hero.y = y;
    }

    if (onIteraction(hero)) break;
  }
}

const getGuard = (data) => {
  const guard = {}

  data.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      if (['>', '<', '^', 'v'].includes(column)) {
        guard.x = columnIndex
        guard.y = rowIndex
        guard.direction = column;
      }
    })
  })

  return guard
}

// first part
const visitedPoisitions = new Set()
walk(data, getGuard(data), ({ y, x }) => {
  visitedPoisitions.add(`y:${y}|x:${x}`)
})
console.log('result', visitedPoisitions.size,  5453);

// second part
let stuckCount = 0;
visitedPoisitions.forEach((position) => {
  const [_,y, x] = position.match(/y:(-*\d*)\|x:(-*\d*)/);
  const newData = data.map((arr) => arr.slice());
  newData[+y][+x] = '#';
  const visitedPoisitions = new Set()

  walk(newData, getGuard(data), (guard) => {
    if (visitedPoisitions.has(strConverter(guard))) {
      stuckCount++
      return true;
    }

    visitedPoisitions.add(strConverter(guard))
  })
})
console.log('got stuck times', stuckCount)
