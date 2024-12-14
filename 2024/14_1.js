import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
data.pop();
// console.log(data)

const robots = data.map((input) => {
  const [_ , pX, pY, vX, vY] = input.match(/p\=(\d+),(\d+) v\=(\-?\d+),(\-?\d+)/);

  return { position: { x: parseInt(pX), y: parseInt(pY) }, velocity: { x: parseInt(vX), y: parseInt(vY) } };
})
console.log(robots.length)

// consts
const seconds = 100;
const bathroom = {
  width: 101,
  height: 103
};
const crossPosition = {
  verticalX: Math.floor(bathroom.width / 2),
  horizontalY: Math.floor(bathroom.height / 2),
}
// console.log(crossPosition)

const robotsAfterSeconds = robots.map(({ velocity, position }) => {
  const newX = (position.x + velocity.x * seconds) % bathroom.width;
  const newY = (position.y + velocity.y * seconds) % bathroom.height

  return {
    velocity,
    position: {
      x: newX >= 0 ? newX : bathroom.width + newX,
      y: newY >= 0 ? newY : bathroom.height + newY,
    }
  }
})
// console.log(robotsAfterSeconds)

const robotsInQuadrants = robotsAfterSeconds.reduce((acc, { position: { x, y } }) => {
  if (x < crossPosition.verticalX && y < crossPosition.horizontalY) {
    acc[0]++;
  } else if (x > crossPosition.verticalX && y < crossPosition.horizontalY) {
    acc[1]++;
  } else if (x > crossPosition.verticalX && y > crossPosition.horizontalY) {
    acc[2]++;
  } else if (x < crossPosition.verticalX && y > crossPosition.horizontalY) {
    acc[3]++;
  }

  return acc;
}, [0, 0, 0, 0])

// console.log(robotsInQuadrants)
const result = robotsInQuadrants.reduce((acc, value) => acc * value, 1);
console.log(result)
