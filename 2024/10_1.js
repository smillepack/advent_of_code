import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
console.log(file);

const data = file.split("\n");
data.pop()
// console.log(data)
const topographicMap = data.map((row) => row.split('').map(Number));
console.log(topographicMap)

const getTrailHeads = (map) => {
  const trailHeads = [];

  map.forEach((row, rowIndex) => {
    row.forEach((point, columnIndex) => {
      if (point !== 0) return;

      trailHeads.push({
        x: columnIndex,
        y: rowIndex
      })
    })
  })

  return trailHeads
}

const getPossibleSteps = ({ x, y }, map) => {
  const height = map[y][x];

  const up = y - 1;
  const down = y + 1;
  const right = x + 1;
  const left = x - 1;

  const possibleSteps = []

  if (map[up]?.[x] === height + 1) {
    possibleSteps.push({ y: up, x })
  }

  if (map[down]?.[x] === height + 1) {
    possibleSteps.push({ y: down, x })
  }

  if (map[y][right] === height + 1) {
    possibleSteps.push({ y, x: right })
  }

  if (map[y][left] === height + 1) {
    possibleSteps.push({ y, x: left })
  }

  return possibleSteps;
}

const getNines = (possition, map) => {
  const nines = new Set()

  walk(possition, map, (nine) => {
    if (!nine) return;

    nines.add(`x:${nine.x}|y:${nine.y}`)
  })

  return Array.from(nines).map((nine) => {
    const [_, x, y ] = nine.match(/x:(\d+)\|y:(\d+)/);
    return { x: parseInt(x), y: parseInt(y) };
  })
}

const walk = (step, map, callback) => {
  const height = map[step.y][step.x];

  if (height === 9) {
    return callback(step);
  }

  const possibleSteps = getPossibleSteps(step, map);

  possibleSteps.forEach((possibleStep) => walk(possibleStep, map, callback));
}

const trailHeads = getTrailHeads(topographicMap)
console.log(trailHeads)

const scores = trailHeads.flatMap((head) => getNines(head, topographicMap))
console.log(scores.length)
