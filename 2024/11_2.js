import { count } from "node:console";
import * as fs from "node:fs/promises";

// const data = '125 17'.split(' ').map((value) => parseInt(value))
const data = '5178527 8525 22 376299 3 69312 0 275'.split(' ').map((stone) => parseInt(stone))

console.log(data)

const store = new Map()
const countStones = (stone, steps) => {
  if (steps === 0) return 1;

  const hasKey = `stone:${stone}|steps:${steps}`;
  const storedStone = store.get(hasKey);

  if (storedStone) return storedStone;

  let amount = 0;

  if (stone === 0) {
    amount = countStones(1, steps - 1);
  } else if (!(`${stone}`.length % 2)) {
    amount = countStones(parseInt(`${stone}`.slice(0, `${stone}`.length / 2)), steps - 1) +
      countStones(parseInt(`${stone}`.slice(`${stone}`.length / 2)), steps - 1);
  } else {
    amount = countStones(stone * 2024, steps - 1)
  }

  store.set(hasKey, amount)

  return amount;
}

const result = data.reduce((acc,stone) => {
  return acc + countStones(stone, 75);
}, 0);

console.log(result)
