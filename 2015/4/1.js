import * as fs from "node:fs/promises";
import crypto from "node:crypto";

// const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

const input = 'iwrupvqb'

const getHash = (input, i) => {
  return crypto.createHash("md5").update(input + i).digest('hex')
}

let i = 0;

while (!getHash(input, i).startsWith('000000')) {
  i++;
}

console.log('i = ', i);

