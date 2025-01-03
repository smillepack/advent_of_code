import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

const input = file.split("\n");

if (input.at(-1) === '') input.pop();

// console.log(input);

const isStringNice = (str) => {
  if (["ab", "cd", "pq", "xy"].some((s) => str.includes(s))) return false;

  const hasDoubleLetters = (new RegExp(/(\w)\1/gi)).test(str);
  const has3Vowels = str.match(new RegExp(/[aeiou]/gi))?.length >= 3;

  return hasDoubleLetters && has3Vowels;
}

const result = input.reduce((acc, str) => {
  return acc + +isStringNice(str);
}, 0);


console.log('result =', result);
