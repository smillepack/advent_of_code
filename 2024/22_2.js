import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const data = file.split("\n").map((row) => BigInt(row));
data.pop();

// console.log(data);

const mix = (input, secret) => input ^ secret;
const prune = (secret) => secret % 16777216n;

const getNextSecret = (s) => {
  s = prune(mix(s * 64n, s));
  s = prune(mix(s / 32n, s));
  return prune(mix(s * 2048n, s));
}

const sequencePrice = new Map();
data.forEach((secret) => {
  let init = secret;
  let value0 = null;
  let value1 = null;
  let value2 = null;
  let value3 = null;
  let value4 = parseInt(secret % 10n);

  for (let i = 0; i < 2000; i++) {
    secret = getNextSecret(secret);
    value0 = value1;
    value1 = value2;
    value2 = value3;
    value4 = parseInt(secret % 10n);

    if (i < 3) continue;

    const sequence = `${value1 - value0};${value2 - value1};${value3 - value2};${value4 - value3}`;

    if (!sequencePrice.has(sequence)) {
      sequencePrice.set(sequence, new Map([[init, value4]]));
      continue;
    }

    const m = sequencePrice.get(sequence);
    if (!m.has(init)) {
      m.set(init, value4);
    }
  }
})

let result = 0;
sequencePrice.forEach((value) => {
  let sum = 0;

  value.forEach((num) => {
    sum += num;
  });

  result = Math.max(result, sum);
});

console.log('result:', result);
