import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

console.log(file);

const funs = new RegExp(/(mul\(\d{1,3},\d{1,3}\))|(don\'t\(\))|(do\(\))/gm);
const matches = [...file.matchAll(funs)].map((match) => match[0]);

console.log(matches);

let skip = false;

const result = matches.reduce((acc, match) => {
  if (match === "don't()") {
    skip = true;
  } else if (match === "do()") {
    skip = false;
    return acc;
  }

  if (skip) return acc;

  const [left, right] = match.replaceAll(/(mul\()|\)/g, "").split(",");
  return acc + +left * +right;
}, 0);

console.log(result);
