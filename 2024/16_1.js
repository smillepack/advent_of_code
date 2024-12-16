import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const map = file.split("\n").map((row) => row.split(''));
if (map.at(-1) === '') map.pop();
// console.log(map)

const getNextPosition = ({ x, y }, direction) => {
  if (direction === 0) return { x, y: y - 1 };
  else if (direction === 90) return { x: x + 1, y };
  else if (direction === 180) return { x, y: y + 1 };
  else if (direction === 270) return { x: x - 1, y };
}

const getPosibilePositions = (position, direction) => {
  const counterclockwiseD = (direction - 90 + 360) % 360;
  const clockwiseD = (direction + 90) % 360;

  return [{
    ...getNextPosition(position, counterclockwiseD),
    direction: counterclockwiseD
  }, {
    ...getNextPosition(position, direction),
    direction: direction
  }, {
    ...getNextPosition(position, clockwiseD),
    direction: clockwiseD
  }];
}

const startY = map.findIndex((row) => row.includes('S'));
const startX = map[startY].findIndex((cell) => cell === 'S');
const endY = map.findIndex((row) => row.includes('E'));
const endX = map[endY].findIndex((cell) => cell === 'E');

(function move(position, direction, score) {
    if (score > map[endY][endX]) return;

    if (Number.isInteger(map[position.y][position.x])) {
      map[position.y][position.x] = Math.min(map[position.y][position.x], score);
    } else {
      map[position.y][position.x] = score;
    }
    const possiblePositions = getPosibilePositions(position, direction);
    possiblePositions.forEach(({ x, y, direction: pd }) => {
        if (map[y][x] === '#') return;
        if (Number.isInteger(map[y][x]) && score > map[y][x]) return;

        if (pd !== direction) {
            move({ x, y }, pd, score + 1001);
        } else {
            move({ x, y }, pd, score + 1);
        }
        
    })

})({ x: startX, y: startY }, 90, 0);

// console.log(map)
console.log(map[endY][endX])