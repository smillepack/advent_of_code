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
pcs.forEach((lists, left) => {
  lists.forEach((right) => {
    pcs.forEach((lists2, left2) => {
      if (left === left2) return;
      if (right === left2) return;

      if (!lists2.includes(left) || !lists2.includes(right)) return;

      sets.add([left, right, left2].sort().join(','));
    });
  });

  pcs.delete(left)
});

let result = 0;
sets.forEach((comb) => {
  if (!comb.startsWith('t') && !comb.includes(',t')) return;

  result++;
});

console.log('result:', result);
