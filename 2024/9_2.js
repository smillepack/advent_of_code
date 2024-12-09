import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
// console.log(file);

const diskMap = file.split("\n")[0];
// console.log(diskMap)

const getFileIdWithFreeSpaces = (input) => {
  const result = []

  for (let i = 0; i < input.length; i+=2) {
    const x = parseInt(input[i])
    const y = parseInt(input[i + 1])
    if (x) {
      result.push({
        amount: x,
        content: i / 2
      })
    }
    if (y) {
      result.push({
        amount: y,
        content: '.'
      })
    }
  }

  return result;
}

const fillFreeSpaces = (result) => {
  for (let i = result.length - 1; i > 0; i--) {
    if (result[i].content === '.') continue;

    for (let j = 0; j < i; j++) {
      if (result[j].content !== '.') continue;
      if (result[j].amount < result[i].amount) continue;

      const diff = result[j].amount - result[i].amount;

      result[j].content = result[i].content
      result[j].amount = result[i].amount
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
  let accumulator = 0;
  let j = 0;
  for (let i = 0; i < data.length; i++) {
    try {
      if (data[i].content === '.') continue;

      for (let m = 0; m < data[i].amount; m++) {
        accumulator += (j + m) * data[i].content
      }
    } finally {
      j += data[i].amount;
    }
  }

  return accumulator;
}

const fileIdWithFreeSpaces = getFileIdWithFreeSpaces(diskMap)
// console.log(fileIdWithFreeSpaces)

const filledData = fillFreeSpaces(fileIdWithFreeSpaces)
// console.log(filledData)

const checkSum = getCheckSum(filledData)
console.log(checkSum)
