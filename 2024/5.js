import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

console.log(file);

const convertedFile = file.split("\n");
convertedFile.pop();
// console.log(convertedFile);

const separateIndex = convertedFile.indexOf("");
const pageOrderingRules = convertedFile.toSpliced(separateIndex);
const pagesToProduceInEachUpdate = convertedFile
  .toSpliced(0, separateIndex + 1)
  .map((pages) => pages.split(","));

console.log(pageOrderingRules);
console.log(pagesToProduceInEachUpdate);

// correct order
// const result = pagesToProduceInEachUpdate.reduce((acc, pages) => {
//   for (let i = 0; i < pages.length - 1; i++) {
//     for (let j = i + 1; j < pages.length; j++) {
//       if (!pageOrderingRules.includes(`${pages[i]}|${pages[j]}`)) return acc;
//     }
//   }
//   return acc + +pages[Math.floor(pages.length / 2)];
// }, 0);
// console.log(result);

// Incorect
// let result = 0;
// pagesToProduceInEachUpdate.forEach((pages) => {
//   let incorect = false;
//   for (let i = 0; i < pages.length - 1; i++) {
//     for (let j = i + 1; j < pages.length; j++) {
//       if (pageOrderingRules.includes(`${pages[j]}|${pages[i]}`)) {
//         incorect = true;
//         [pages[i], pages[j]] = [pages[j], pages[i]];
//       }
//     }
//   }
//   if (!incorect) return;
//   console.log(pages);
//   result += +pages[Math.floor(pages.length / 2)];
// });
// console.log(result);
