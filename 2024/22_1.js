import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const data = file.split("\n").map((row) => BigInt(row));
data.pop();

const mix = (input, secret) => input ^ secret;
const prune = (secret) => secret % 16777216n;

const getNextSecret = (s) => {
  const x = prune(mix(s * 64n, s));
  const y = prune(mix(x / 32n, x));
  const z = prune(mix(y * 2048n, y));

  return z;
}

const getSecretAfter = (s) => {
  let secret = s;

  for (let i = 0; i < 2000; i++) {
    secret = getNextSecret(secret);
  }

  return secret;
}

const result = data.reduce((acc, value) => acc + getSecretAfter(value), 0n)
console.log('result:', result);
