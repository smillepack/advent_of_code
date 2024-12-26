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

  for (let i = 0; i < colorPatterns.length; i++) {
    if (!towel.startsWith(colorPatterns[i])) continue;
    if (!canBeBuild(towel.replace(colorPatterns[i], ''))) continue;

    store.set(towel, true);
    return true;
  }

  store.set(towel, false);
  return false;
}

const result = towels.reduce((acc, towel) => acc + +canBeBuild(towel), 0);
console.log('result ', result);
