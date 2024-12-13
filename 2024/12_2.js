import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
data.pop()
const garden = data.map((row) => row.split(''));
// console.log(garden)
console.log(garden.length, garden[0].length)

const pToStr = (x, y) => `x:${x}|y:${y}`
const strToP = (str) => {
  const [_, x, y] = str.match(/x:(\d+)\|y:(\d+)/);
  return {
    x: parseInt(x) ,
    y: parseInt(y)
  }
}

const setPositionSide = (map, side, key, value) => {
  if (map.has(`${side}:${key}`)) {
    map.get(`${side}:${key}`).push(value)
  } else {
    map.set(`${side}:${key}`, [value])
  }
}

const getRegionSides = (region) => {
  const sidePositioins = new Map()

  region.forEach((position) => {
    const { x, y } = strToP(position);

    if (!region.has(pToStr(x, y - 1))) setPositionSide(sidePositioins, 'top', y, x);
    if (!region.has(pToStr(x, y + 1))) setPositionSide(sidePositioins, 'down', y, x)
    if (!region.has(pToStr(x + 1, y))) setPositionSide(sidePositioins, 'right', x, y)
    if (!region.has(pToStr(x - 1, y))) setPositionSide(sidePositioins, 'left', x ,y)
  })

  let sideAmount = 0;

  sidePositioins.forEach((sides) => {
    let lastSide = -Infinity;
    sides.sort((a, b) => a - b).forEach((side) => {
      if (side - lastSide >= 2) sideAmount++;
      lastSide = side;
    })
  })

  return sideAmount;
}


const walkAroundGardenFor = ({ x, y }, plot, region) => {
  const up = y - 1;
  const right = x + 1;
  const down = y + 1;
  const left = x - 1;
  const sizeBefore = region.size

  if (garden[up]?.[x] === plot) region.add(pToStr(x, up));
  if (garden[down]?.[x] === plot) region.add(pToStr(x, down));
  if (garden[y][right] === plot) region.add(pToStr(right, y));
  if (garden[y][left] === plot) region.add(pToStr(left, y));

  if (region.size === sizeBefore) return;

  region.forEach((position) => walkAroundGardenFor(strToP(position), plot, region));
}

const getRegions = () => {
  const regions = []

  garden.forEach((row, rowIndex) => {
    row.forEach((plot, columnIndex) => {
      if (regions.some((region) => region.has(pToStr(columnIndex, rowIndex)))) {
        return;
      }

      const region = new Set([pToStr(columnIndex, rowIndex)])
      walkAroundGardenFor({ x: columnIndex, y: rowIndex }, plot, region);
      regions.push(region);
    });
  });

  return regions;
}

const regions = getRegions()
// console.log(regions)
const price = regions.reduce((acc, region) => acc + region.size * getRegionSides(region), 0)
console.log(price)
