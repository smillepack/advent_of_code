import * as fs from "node:fs/promises";

// const file = await fs.readFile("dummy_small.txt", { encoding: "utf8" });
const file = await fs.readFile("dummy.txt", { encoding: "utf8" });
const data = file.split("\n").map((row) => row.split(''));
data.pop();

console.log(data)

const numCoords = new Map([
  ['A', { x: 2, y: 3 }],
  ['0', { x: 1, y: 3 }],
  ['1', { x: 0, y: 2 }],
  ['2', { x: 1, y: 2 }],
  ['3', { x: 2, y: 2 }],
  ['4', { x: 0, y: 1 }],
  ['5', { x: 1, y: 1 }],
  ['6', { x: 2, y: 1 }],
  ['7', { x: 0, y: 0 }],
  ['8', { x: 1, y: 0 }],
  ['9', { x: 2, y: 0 }],
]);
const moveCoords = new Map([
  ['^', { x: 1, y: 0 }],
  ['>', { x: 2, y: 1 }],
  ['v', { x: 1, y: 1 }],
  ['<', { x: 0, y: 1 }],
  ['A', { x: 2, y: 0 }],
]);

const getMoves = (to, from, isNum) => {
  const dangerY = isNum ? 3 : 0;
  const dangerX = 0;

  const skipX = from.y === dangerY && to.x === dangerX;
  const skipY = from.x === dangerX && to.y === dangerY;

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  let my = (dy > 0 ? 'v' : '^').repeat(Math.abs(dy));
  let mx = (dx > 0 ? '>' : '<').repeat(Math.abs(dx));

  if (dx === 0 || dy === 0) return [my + mx + 'A'];

  if (skipY) {
    return [mx + my + 'A'];
  } else if (skipX) {
    return [my + mx + 'A']
  } else {
    return [my + mx + 'A', mx + my + 'A'];
  }
};

const store = new Map();
const getMoveLength = (to, from, step, isNum = false) => {
  if (step === 0) return 1;
  const hashKey = `to(${to.x},${to.y});from(${from.x},${from.y});step(${step});`
  if (store.has(hashKey)) return store.get(hashKey)

  const sequences = getMoves(to, from, isNum);

  const lengths = sequences.map((sequence) => {
    const arr = sequence.split('');

    const sum = arr.reduce((acc, sMove, index) => {
      const to = moveCoords.get(sMove);
      const from = index === 0 ? moveCoords.get('A') : moveCoords.get(arr[index - 1]);

      return acc + getMoveLength(to, from, step - 1);
    }, 0);

    return sum;
  });

  const result = Math.min(...lengths);
  store.set(hashKey, result);
  return result;
};

const result = data.reduce((acc, input, i) => {
  const inputR = input.reduce((acc, move, index, arr) => {
    const to = numCoords.get(move);
    const from = index === 0 ? numCoords.get('A') : numCoords.get(arr[index - 1]);
    const length = getMoveLength(to, from, 26, true);

    return acc + length;
  }, 0);

  return acc + inputR * parseInt(input.join(''));
}, 0);
console.log('result =', result);
