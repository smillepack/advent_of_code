import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

const input = file.split("\n");

if (input.at(-1) === '') input.pop();

// console.log(input);

const isStringNice = (str) => {
  const rule1 = (new RegExp(/(\w).\1/gi)).test(str);
  const rule2 = (new RegExp(/(\w)(\w).*\1\2/gi)).test(str);

  return rule1 && rule2;
}

const result = input.reduce((acc, str) => {
  return acc + +isStringNice(str);
}, 0);


console.log('result =', result);
