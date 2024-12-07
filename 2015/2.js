import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

const convertedFile = file.split("\n");

convertedFile.pop();

console.log(convertedFile.at(-1));

const result = convertedFile.reduce((acc, str) => {
  const arr = str.split("x").map(Number);
  const [l, w, h] = arr;
  const max = Math.max(...arr);
  const [a, b] = arr.toSpliced(arr.indexOf(max), 1);

  if (Math.max(a, b) === max) {
    console.log("kek", arr, max, arr.toSpliced(arr.indexOf(max), 1));
  }

  return acc + l * w * h + 2 * a + 2 * b;
}, 0);

console.log(result);
