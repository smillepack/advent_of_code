import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const data = file.split("\n");
if (data.at(-1) === '') data.pop();

const colorPatterns = data[0].split(', ').sort((a, b) => b.length - a.length);
const towels = data.toSpliced(0, 2);

const store = new Map();
const canBeBuild = (towel) => {
  if (towel.length === 0) return true;
  if (store.has(towel)) return store.get(towel);

  const starts = [];
  colorPatterns.forEach((pattern) => {
    if (!towel.startsWith(pattern)) return;

    starts.push(towel.replace(pattern, ''));
  });

  const some = starts.some(canBeBuild);
  store.set(towel, some);

  return some;
}

const result = towels.reduce((acc, towel) => acc + +canBeBuild(towel), 0);
console.log('result ', result)