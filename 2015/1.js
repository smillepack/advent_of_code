import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

const convertedFile = file.split("");

console.log(convertedFile);

let firstBasementPosition = 0;

const result = convertedFile.reduce((acc, value, index) => {
  if (value === "(") return acc + 1;
  if (value === ")") {
    if (!acc && !firstBasementPosition) {
      firstBasementPosition = index + 1;
    }

    return acc - 1;
  }
}, 0);

console.log(firstBasementPosition);
