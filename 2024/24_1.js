import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const data = file.split("\n")
// data.pop();

console.log(data)

const separator = data.indexOf('');

const refsData = data.toSpliced(separator);
const inputData = data.toSpliced(0, separator + 1);

const refs = new Map();
refsData.forEach((str) => {
  const [key, value] = str.split(": ");

  refs.set(key, parseInt(value));
});
console.log('refs', refs)

const rules = [];
inputData.forEach((str) => {
  const [leftKey, command, rightKey,, result] = str.split(' ')

  rules.push({ leftKey, command, rightKey, result });
});

const commands = new Map([
  ['AND', (l, r) => l & r],
  ['OR', (l, r) => l | r],
  ['XOR', (l, r) => l ^ r],
]);

while (rules.some(({ leftKey, rightKey, result }) => !refs.has(leftKey) || !refs.has(rightKey) || !refs.has(result))) {
  rules.forEach(({ leftKey, command, rightKey, result }) => {
    if (!refs.has(leftKey) || !refs.has(rightKey)) return;

    refs.set(result, commands.get(command)(refs.get(leftKey), refs.get(rightKey)));
  });
};

let result = [];
refs.forEach((_, key) => {
  if (!key.startsWith('z')) return;

  result.push(key)
});
result = result.sort().reverse().map((key) => refs.get(key)).join('');
console.log('result', parseInt(result, 2));
