import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
data.pop();
// console.log(data)

let robots = data.map((input) => {
  const [_ , pX, pY, vX, vY] = input.match(/p\=(\d+),(\d+) v\=(\-?\d+),(\-?\d+)/);

  return { position: { x: parseInt(pX), y: parseInt(pY) }, velocity: { x: parseInt(vX), y: parseInt(vY) } };
})

// consts
const seconds = 1;
const bathroom = {
  width: 101,
  height: 103
};

(function print(time) {
  if (time === 8087) return;
  // console.log(`print ${time}`)

  const picture = Array(bathroom.height).fill(null).map(() => Array(bathroom.width).fill('.'));

  robots = robots.map(({ velocity, position }) => {
    const newX = (position.x + velocity.x * seconds) % bathroom.width;
    const newY = (position.y + velocity.y * seconds) % bathroom.height;
    const x = newX >= 0 ? newX : bathroom.width + newX;
    const y = newY >= 0 ? newY : bathroom.height + newY;

    picture[y][x] = '#'

    return {
      velocity,
      position: { x, y }
    }
  })
  if (time === 8086) {
    console.log(picture.map((row) => row.join('') + '\n').join(''))
  }

  print(time + 1)

})(0);
// 8086
