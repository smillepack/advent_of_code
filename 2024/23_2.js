import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const data = file.split("\n")
data.pop();

const pcs = new Map();
data.forEach((connection) => {
  const [left, right] = connection.split('-');

  if (!pcs.has(left)) {
    pcs.set(left, [right]);
  } else {
    pcs.get(left).push(right);
  }

  if (!pcs.has(right)) {
    pcs.set(right, [left]);
  } else {
    pcs.get(right).push(left);
  }
})

const sets = new Set();
pcs.forEach((list, left) => {
  const results = new Set();

  for (let i = 0; i < list.length; i++) {
    const result = [left, list[i]];

    for (let j = 0; j < list.length; j++) {
      if (i === j) continue;

      if (result.every((lan) => pcs.get(lan)?.includes(list[j]))) {
        result.push(list[j]);
      }
    }

    results.add(result.join(','));
  }

  results.forEach((comb) => sets.add(comb));
  pcs.delete(left);
});


let longest = '';
sets.forEach((lan) => {
  if (lan.length <= longest.length) return;

  longest = lan;
})

console.log('result', longest.split(',').sort().join(','))
