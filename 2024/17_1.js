import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

const data = file.split("\n");
if (data.at(-1) === '') data.pop();
console.log(data)

const program = [];
const registers = {
  a: 0,
  b: 0,
  c: 0
}

data.forEach((value, index) => {
  if (index === 0) {
    registers.a = parseInt(value.replace('Register A:', ''))
  } else if (index === 1) {
    registers.b = parseInt(value.replace('Register B:', ''))
  } else if (index === 2) {
    registers.c = parseInt(value.replace('Register C:', ''))
  } else if (index === 4) {
    program.push(...value.replace('Program: ', '').split(',').map(Number))
  }
})
console.log(registers, program)

const comboOperand = (operand) => {
  if ([0, 1, 2, 3].includes(operand)) {
    return operand;
  } else if (operand === 4) {
    return registers.a;
  } else if (operand === 5) {
    return registers.b;
  } else if (operand === 6) {
    return registers.c;
  }
}

// instructions
//
const adv = (operand) => {
  registers.a = Math.trunc(registers.a / (2 ** comboOperand(operand)));
};
const bxl = (operand) => {
  registers.b = registers.b ^ operand;
};
const bst = (operand) => {
  registers.b = comboOperand(operand) % 8;
}
const jnz = (operand) => {
  return registers.a === 0 ? false : operand;
}
const bxc = () => {
  registers.b = registers.b ^ registers.c;
}
const output = [];
const out = (operand) => {
  output.push(comboOperand(operand) % 8);
};
const bdv = (operand) => {
  registers.b = Math.trunc(registers.a / (2 ** comboOperand(operand)));
}
const cdv = (operand) => {
  registers.c = Math.trunc(registers.a / (2 ** comboOperand(operand)));
}

for (let i = 0; i < program.length; i += 2) {
  const opcode = program[i];
  const operand = program[i + 1];

  if (opcode === 0) {
    adv(operand);
  } else if (opcode === 1) {
    bxl(operand);
  } else if (opcode === 2) {
    bst(operand);
  } else if (opcode === 3) {
    const jump = jnz(operand);
    if (jump === false) continue;
    i = jump - 2;
  } else if (opcode === 4) {
    bxc(operand)
  } else if (opcode === 5) {
    out(operand);
  } else if (opcode === 6) {
    bdv(operand);
  } else if (opcode === 7) {
    cdv(operand);
  }
}
console.log(output.join(','));
