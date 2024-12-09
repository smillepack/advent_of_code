import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

// console.time('start')

const diskMap = file.split("\n")[0];
// diskMap.pop();
// console.log(diskMap)

const getFileIdWithFreeSpaces = (input) => {
  const result = []

  for (let i = 0; i < input.length; i++) {
    if (i % 2) {
      // odd 1
      for (let j = 0; j < +input[i]; j++) {
        result.push('.')
      }
    } else {
      // even 0
      for (let j = 0; j < +input[i]; j++) {
        result.push(BigInt(i / 2))
      }
    }
  }

  return result;
}

const fillFreeSpaces = (code) => {
  const result = [...code]
  let lastJ = code.length - 1;

  for (let i = 0; i < code.length; i++) {
    if (i === lastJ) break;
    if (result[i] !== '.') continue;

    for (let j = lastJ; j > i; j--) {
      if (result[j] === '.') continue;

      result[i] = result[j];
      result[j] = '.';
      lastJ = j;
      break;
    }
  }
  return result
}


const getCheckSum = (data) => {
  let accumulator = 0n;

  for (let i = 0n; i < data.length; i++) {
    if (data[i] === '.') break;

    accumulator += i * BigInt(data[i]);
  }

  return accumulator;
}

const fileIdWithFreeSpaces = getFileIdWithFreeSpaces(diskMap)
// console.log(fileIdWithFreeSpaces)

const filledData = fillFreeSpaces(fileIdWithFreeSpaces)
// console.log(filledData)

const checkSum = getCheckSum(filledData)
console.log(checkSum)

// console.timeEnd('start')
// 90779541117 - too low
// 6382875730645 -- right one
