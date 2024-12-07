import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

console.log(file);

const convertedFile = file.split("\n").map((row) => row.split(""));
convertedFile.pop();

// First part
// const word = "XMAS";
// const reverseWord = "SAMX";
// const words = [word, reverseWord];
// let result = 0;

// for (let row = 0; row < convertedFile.length; row++) {
//   for (let column = 0; column < convertedFile[row].length; column++) {
//     const leftDiagonal = [];
//     const rightDiagonal = [];
//     const rowWord = [];
//     const columnWord = [];

//     const canCheckRow = column + word.length - 1 < convertedFile[row].length;
//     const canCheckColumn = row + word.length - 1 < convertedFile.length;

//     for (let i = 0; i < word.length; i++) {
//       if (canCheckRow) rowWord.push(convertedFile[row][column + i]);
//       if (canCheckColumn) columnWord.push(convertedFile[row + i][column]);

//       if (!canCheckRow || !canCheckColumn) continue;

//       leftDiagonal.push(convertedFile[row + i][column + i]);
//       rightDiagonal.push(convertedFile[row + word.length - 1 - i][column + i]);
//     }

//     result += +words.includes(leftDiagonal.join(""));
//     result += +words.includes(rightDiagonal.join(""));
//     result += +words.includes(columnWord.join(""));
//     result += +words.includes(rowWord.join(""));
//   }
// }

// console.log(result); //2545

// Second
const word = "MAS";
const reverseWord = "SAM";
const words = [word, reverseWord];
let result = 0;

for (let row = 0; row < convertedFile.length; row++) {
  for (let column = 0; column < convertedFile[row].length; column++) {
    const leftDiagonal = [];
    const rightDiagonal = [];

    const canCheckRow = column + word.length - 1 < convertedFile[row].length;
    const canCheckColumn = row + word.length - 1 < convertedFile.length;

    for (let i = 0; i < word.length; i++) {
      if (!canCheckRow || !canCheckColumn) continue;

      leftDiagonal.push(convertedFile[row + i][column + i]);
      rightDiagonal.push(convertedFile[row + word.length - 1 - i][column + i]);
    }

    result += +(
      words.includes(leftDiagonal.join("")) &&
      words.includes(rightDiagonal.join(""))
    );
  }
}

console.log(result); // 1886
