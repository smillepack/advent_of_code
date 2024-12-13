import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
// console.log(data)

const aToken = 3;
const bToken = 1;

let iteraction = 0;

const getButtonSpecs = (input) => {
  const [_, buttonType, x, y] = input.match(
    /Button ([A-Z])\: X\+(\d+), Y\+(\d+)/,
  );

  return { tokenCost: buttonType === "A" ? aToken : bToken, x: +x, y: +y };
};

const getPrize = (input) => {
  const [_, x, y] = input.match(/Prize: X=(\d+), Y=(\d+)/);
  return { x: +x, y: +y };
};

const convertedData = data
  .map((row) => {
    if (row.startsWith("Button")) return getButtonSpecs(row);
    if (row.startsWith("Prize")) return getPrize(row);

    return null;
  })
  .filter(Boolean);

const getFewestTokenCost = (a, b, p) => {
  for (let i = 0; true; i++) {
    const bxAmount = (p.x - a.x * i) / b.x;
    const byAmount = (p.y - a.y * i) / b.y;

    if (bxAmount === byAmount) {
      return i * aToken + bxAmount * bToken;
    }

    if (a.x * i > p.x || a.y * i > p.y) return 0;
  }
};

let result = 0;
for (let i = 0; i < convertedData.length; i += 3) {
  const buttonA = convertedData[i];
  const buttonB = convertedData[i + 1];
  const prize = convertedData[i + 2];

  result += getFewestTokenCost(buttonA, buttonB, prize);
}

console.log(result, iteraction);
