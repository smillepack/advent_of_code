import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

const convertedFile = file.split("\n")[0];

console.log(convertedFile);

const convertCoordinates = (input, hero) => {
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

const visitedHouses = new Set(["x:0;y:0;"]);

let santa = {
  x: 0,
  y: 0,
};
let roboSanta = {
  x: 0,
  y: 0,
};

for (let i = 0; i < convertedFile.length; i++) {
  if (i % 2) {
    santa = convertCoordinates(convertedFile[i], santa);
  } else {
    roboSanta = convertCoordinates(convertedFile[i], roboSanta);
  }

  visitedHouses.add(`x:${santa.x};y:${santa.y};`);
  visitedHouses.add(`x:${roboSanta.x};y:${roboSanta.y};`);
}

console.log(visitedHouses);
