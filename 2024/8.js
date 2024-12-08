import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

// console.log(file);

const convertedFile = file.split("\n");
convertedFile.pop();
// console.log(convertedFile)

const data = convertedFile.map((row) => {
	return row.split("");
})

console.log(data)

const antennas = new Map();

data.forEach((row, rowIndex) => {
	row.forEach((cell, columnIndex) => {
		if (cell === ".") return;

		if (!antennas.has(cell)) {
			antennas.set(cell, []);
		}

		const positions = antennas.get(cell);

		positions.push({ x: columnIndex, y: rowIndex });
	});
})


console.log(antennas);


const antinodes = new Set();

antennas.forEach((value) => {
 value.forEach((antenna, i) => {
   if (value.length > 1) antinodes.add(`y:${antenna.y}|x:${antenna.x}`)

  value.forEach((anotherAntenna, j) => {
    if (i === j) return;

    const xStep = antenna.x - anotherAntenna.x;
		const yStep = antenna.y - anotherAntenna.y

		for (let m = xStep, l = yStep; antenna.x + m >= 0 && antenna.x + m < data[0].length && antenna.y + l >= 0 && antenna.y + l < data.length; m += xStep, l += yStep) {
			const antinodeX = antenna.x + m
			const antinodeY = antenna.y + l

			antinodes.add(`y:${antinodeY}|x:${antinodeX}`)
		}
  })
 })
});


console.log(antinodes, antinodes.size);
