import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
if (data.at(-1) === '') data.pop();

const program = [];

data.forEach((value, index) => {
  if (index === 4) {
    program.push(...value.replace('Program: ', '').split(',').map(Number))
  }
})


const comboOperand = (o, r) => {
  if ([0n, 1n, 2n, 3n].includes(o)) {
    return o;
  } else if (o === 4n) {
    return r.a;
  } else if (o === 5n) {
    return r.b;
  } else if (o === 6n) {
    return r.c;
  }
};

const getOutput = (r) => {
  const output = [];

  for (let i = 0; i < program.length; i += 2) {
    const opcode = program[i];
    const operand = BigInt(program[i + 1]);
  
    if (opcode === 0) {
      r.a = r.a / (2n ** comboOperand(operand, r));
    } else if (opcode === 1) {
      r.b = r.b ^ operand;
    } else if (opcode === 2) {
      r.b = comboOperand(operand, r) % 8n;
    } else if (opcode === 3) {
      if (r.a === 0n) continue;

      i = parseInt(operand - 2n);
    } else if (opcode === 4) {
      r.b = r.b ^ r.c;
    } else if (opcode === 5) {
      output.push(comboOperand(operand, r) % 8n);
    } else if (opcode === 6) {
      r.b = r.a / (2n ** comboOperand(operand, r));
    } else if (opcode === 7) {
      r.c = r.a / (2n ** comboOperand(operand, r));
    }
  }

  return output;
};

const getMinBigInt = (arr) => {
  return arr.reduce((acc, value) => acc > value ? value : acc, Infinity);
}

const reversedProgram = program.toReversed();
const getResult = (expectedA = 0n, index = 0) => {
  if (index === reversedProgram.length) return expectedA;

  const eAs = [];
  for (let a = expectedA * 8n; a < expectedA * 8n + 8n; a++) {
    const output = getOutput({ a, b: 0n, c: 0n });
    if (output[0] !== BigInt(reversedProgram[index])) continue;

    eAs.push(a);
  }

  return getMinBigInt(eAs.map((a) => getResult(a, index + 1)));
}

const result = getResult();
console.log('result', result);
