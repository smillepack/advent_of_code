import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const data = file.split("\n")

const locks = [];
const keys = [];

let columns = [0, 0, 0, 0, 0];
let isLock = true;
let isChangable = true;

data.forEach((row) => {
  if (isChangable) {
    isLock = row === '#####';
    isChangable = false;

    if (isLock) {
      columns = Array(5).fill(0);
    } else {
      columns = Array(5).fill(-1);
    }

    return;
  }

  if (row === '') {
    isChangable = true;

    if (isLock) {
      locks.push([...columns]);
    } else {
      keys.push([...columns]);
    }

    return;
  }

  for (let i = 0; i < row.length; i++) {
    if (row[i] === '.') continue;

    columns[i] += 1;
  }
});

let fits = 0;

keys.forEach((key) => {
  locks.forEach((lock) => {
    let fit = true;

    for (let i = 0; i < lock.length; i++) {
      if (lock[i] + key[i] > 5) {
        fit = false;
        break;
      }
    }

    if (!fit) return;

    fits++;
  });
});

console.log('fits', fits)
