import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });

// console.log(file);

console.time('start')

const diskMap = file.split("\n")[0];
// console.log(diskMap)

const getFileIdWithFreeSpaces = (input) => {
  const result = []

  for (let i = 0; i < input.length; i++) {
    const data = +input[i];

    if (!data) continue;

    result.push({
      amount: data,
      content: i % 2 ? '.' : BigInt(i / 2)
    })
  }

  return result;
}

const fillFreeSpaces = (code) => {
  const result = [...code]

  for (let i = result.length - 1; i > 0; i--) {
    const id = {...result[i]}
    if (id.content === '.') continue;

    for (let j = 0; j < i; j++) {
      const dot = {...result[j]};

      if (dot.content !== '.') continue;
      if (dot.amount < id.amount) continue;

      const diff = dot.amount - id.amount;

      result[j].content = id.content
      result[j].amount = id.amount
      result[i].content = '.'

      if (!diff) break;

      result.splice(j + 1, 0, {
        amount: diff,
        content: '.'
      })
      i++;

      break;
    }
  }

  return result
}


const getCheckSum = (data) => {
  let accumulator = 0n;

  let j = 0n;
  for (let i = 0n; i < data.length; i++) {
    const obj = data[i]

    if (obj.content === '.') {
      j += BigInt(obj.amount);
      continue;
    }

    for (let m = 0n; m < obj.amount; m++) {
      accumulator += (j + m) * obj.content
    }

    j += BigInt(obj.amount);
  }

  return accumulator;
}

const fileIdWithFreeSpaces = getFileIdWithFreeSpaces(diskMap)
// console.log(fileIdWithFreeSpaces)

const filledData = fillFreeSpaces(fileIdWithFreeSpaces)
// console.log(filledData)

const checkSum = getCheckSum(filledData)
console.log(checkSum)

console.timeEnd('start')
