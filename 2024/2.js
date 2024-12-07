import * as fs from "node:fs/promises";

const file = await fs.readFile("dummy.txt", { encoding: "utf8" });

console.log(file);

const reports = [];

file.split("\n").forEach((data, index) => {
  const levels = data.split(" ").map(Number);

  if (index === 1000) return;

  reports.push(levels);
});

const areLevelsSafe = (current, previous, isIncreasing) => {
  if (previous === undefined) return true;

  const diff = Math.abs(previous - current);

  if (diff > 3 || diff < 1) return false;

  return isIncreasing ? previous < current : previous > current;
};

const isReportSafe = (report) => {
  return report.every((level, index) =>
    areLevelsSafe(level, report[index - 1], report[1] > report[0]),
  );
};

const checkDamperReports = (report) => {
  return report.some((_, index) => isReportSafe(report.toSpliced(index, 1)));
};

const safeAmount = reports.reduce(
  (acc, report) => acc + +checkDamperReports(report),
  0,
);

console.log(safeAmount);
