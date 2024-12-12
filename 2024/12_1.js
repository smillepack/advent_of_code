import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
data.pop()
const garden = data.map((row) => row.split(''));
// console.log(garden)

const pToStr = (x, y) => `x:${x}|y:${y}`
const strToP = (str) => {
  const [_, x, y] = str.match(/x:(\d+)\|y:(\d+)/);
  return {
    x: parseInt(x) ,
    y: parseInt(y)
  }
}

const getRegionPerimeter = (region) => {
  let perimeter = 0;

  region.forEach((position) => {
    const { x, y } = strToP(position);

    const up = y - 1;
    const right = x + 1;
    const down = y + 1;
    const left = x - 1;

    let unconectedSides = 4
    if (region.has(pToStr(x, up))) unconectedSides--;
    if (region.has(pToStr(x, down))) unconectedSides--;
    if (region.has(pToStr(right, y))) unconectedSides--;
    if (region.has(pToStr(left, y))) unconectedSides--;

    perimeter += unconectedSides
  })

  return perimeter;
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

const getRegionFrom = (plot, {x,y}) => {
  const region = new Set([pToStr(x, y)])

  walkAroundGardenFor({ x, y }, plot, region);

  return region;
}

const getRegions = () => {
  const regions = []

  garden.forEach((row, rowIndex) => {
    row.forEach((plot, columnIndex) => {
      if (regions.some((region) => region.has(pToStr(columnIndex, rowIndex)))) {
        return;
      }

      regions.push(getRegionFrom(plot, { x: columnIndex, y: rowIndex }));
    });
  });

  return regions;
}

const regions = getRegions()
// console.log(regions)
const price = regions.reduce((acc, region) => acc + region.size * getRegionPerimeter(region), 0)
console.log(price)
