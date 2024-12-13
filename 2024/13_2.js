import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");

const prizeShift = 10000000000000;
const aToken = 3;
const bToken = 1;

const getButtonSpecs = (input) => {
  const [_, buttonType, x, y] = input.match(
    /Button ([A-Z])\: X\+(\d+), Y\+(\d+)/,
  );

  return { tokenCost: buttonType === "A" ? aToken : bToken, x: +x, y: +y };
};

const getPrize = (input) => {
  const [_, x, y] = input.match(/Prize: X=(\d+), Y=(\d+)/);
  return { x: +x + prizeShift, y: +y + prizeShift };
};

const convertedData = data
  .map((row) => {
    if (row.startsWith("Button")) return getButtonSpecs(row);
    if (row.startsWith("Prize")) return getPrize(row);

    return null;
  })
  .filter(Boolean);

let result = 0n;
for (let i = 0; i < convertedData.length; i += 3) {
  const a = convertedData[i];
  const b = convertedData[i + 1];
  const p = convertedData[i + 2];

  const bA = (a.x * p.y - a.y * p.x) / (a.x * b.y - a.y * b.x);
  const aA = (b.x * p.y - b.y * p.x) / (b.x * a.y - a.x * b.y);

  if (Number.isInteger(bA) && Number.isInteger(aA)) {
    result += BigInt(aToken * aA + bToken * bA)
  }
}

console.log(result);
