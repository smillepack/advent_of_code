import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

const convertedFile = file.split("\n");
convertedFile.pop();
// console.log(convertedFile)
const data = convertedFile.map((row) => row.split(': ').map((str, index) => {
  if (!index) {
    return +str
  } else {
    return str.split(' ').map(Number)
  }
} ))
console.log(data);

let result = 0;
data.forEach(([total, equation]) => {
  const sums = equation.reduce((acc, num, index) => {
    if (!index) return acc;

    return acc.flatMap((sum) => [sum + num, sum * num, +`${sum}${num}`])
  }, [equation[0]]);

  if (sums.includes(total)) {
    result += total;
  }
})

console.log('result', result)
