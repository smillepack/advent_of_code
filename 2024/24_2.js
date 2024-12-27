import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const data = file.split("\n")
const separator = data.indexOf('');

const refsData = data.toSpliced(separator);
const inputData = data.toSpliced(0, separator + 1);

const refs = new Map();
refsData.forEach((str) => {
  const [key, value] = str.split(": ");

  refs.set(key, parseInt(value));
});

const rules = [];
inputData.forEach((str) => {
  const [leftKey, command, rightKey,, result] = str.split(' ')

  rules.push({ keys: [leftKey, rightKey], command, result });
});

const getRule = (x, y, c) => {
  return rules.find(({ keys, command, result }) => {
    if (keys.includes(x) && keys.includes(y) && command === c) {
      return result;
    } else {
      return false;
    }
  });
}

const x00 = `x${('0' + 0).slice(-2)}`;
const y00 = `y${('0' + 0).slice(-2)}`;
let carry = getRule(x00, y00, 'AND');

const swapped = [];
for (let i = 1; i <= 40; i++) {
  const xnn = `x${('0' + i).slice(-2)}`;
  const ynn = `y${('0' + i).slice(-2)}`;  
  const xXORy = getRule(xnn, ynn, 'XOR');
  const xANDy = getRule(xnn, ynn, 'AND');

  const z = getRule(carry.result, xXORy.result, 'XOR');
  const prepCarry = getRule(carry.result, xXORy.result, 'AND');

  if (z === undefined && prepCarry === undefined) {
    [xXORy.result, xANDy.result] = [xANDy.result, xXORy.result];

    i = 0;
    carry = getRule(x00, y00, 'AND');
    swapped.push(xXORy.result, xANDy.result);
    continue;
  }
  
  carry = getRule(prepCarry.result, xANDy.result, 'OR');

  if (!z.result.startsWith('z')) {
    const current = rules.find(({ result }) => result === z.result);
    const expected = rules.find(({ result }) => result === `z${('0' + i).slice(-2)}`);

    [current.result, expected.result] = [expected.result, current.result];

    i = 0;
    carry = getRule(x00, y00, 'AND');
    swapped.push(current.result, expected.result);
  }
}

console.log('swapped', swapped.toSorted().join(','));
