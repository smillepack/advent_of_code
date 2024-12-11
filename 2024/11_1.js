import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
// const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
// console.log(file);

// const data = file.split("\n");
// data.pop()
const data = '125 17'.split(' ').map(Number);
// const data = '5178527 8525 22 376299 3 69312 0 275'.split(' ').map(Number);

console.log(data)

let result = [...data]

const total = 25
for (let i = 0; i < total; i++) {
  const newResult = []
  console.log('\ni: ', i +1, 'of ', total +1)
  console.time(`step: ${i + 1}`)


  for (let j = 0; j < result.length; j++) {
    const stone = result[j]
    if (stone === 0) {
      newResult.push(1)
      continue;
    }

    const stringStone = `${stone}`
    if (!(stringStone.length % 2)) {
      newResult.push(parseInt(stringStone.slice(0, stringStone.length / 2)))
      newResult.push(parseInt(stringStone.slice(stringStone.length / 2)))
      continue;
    }

    newResult.push(stone * 2024)
  }

  result = newResult
  console.timeEnd(`step: ${i + 1}`)
}

console.log(result.length)
