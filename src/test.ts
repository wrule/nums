
import { nums } from './index';

const b = nums([
  73.82, 55.31, 54.65, 55.57, 56.21,
  55.77, 48.17, 48.16, 41.31, 47.84,
  46.78, 42.06, 40.97, 50.80, 49.17,
  68.31, 59.51, 73.45, 76.15, 70.21,
  69.93, 64.81, 61.67, 54.24, 50.81,
  49.30, 51.42, 50.69, 49.36, 44.97,
  42.61, 47.48, 47.06, 39.96, 39.85,
  42.48, 44.34, 42.18, 42.62, 40.86,
  40.39, 40.95, 45.14, 49.51, 45.65,
  46.43, 45.66, 46.78,
]);

const ENS = [
  [43.66, 120.00, 43.66, 73.82],
  [73.87, 86.76, 55.06, 55.31],
  [55.38, 64.94, 50.00, 54.65],
  [54.60, 63.58, 48.00, 55.57],
  [55.58, 62.49, 53.20, 56.21],
];

const minNums = nums(ENS.map((item) => item[2]));
const maxNums = nums(ENS.map((item) => item[1]));

const openNums  = nums([3, 4, 5, 8, 12, 33, 30, 15, 15]);
const closeNums = nums([4, 5, 8, 12, 33, 30, 15, 15, 16]);
const result = closeNums.RS(openNums, 2);
// console.log(result);

const tests = [
  [46.78, 46.83, 41.39, 42.06],
  [42.06, 47.13, 39.86, 40.97],
  [40.92, 53.00, 40.46, 50.80],
];
// 20.44
// 16.07
// 82.70

function kkk(a1: number, a2: number, b1: number, b2: number) {
  const c = [a1 - a2, b1 - b2];
  let rise = 0;
  let fall = 0;
  c.forEach((num) => {
    if (num > 0) {
      rise += num;
    } else {
      fall += -num;
    }
  });
  return rise / (rise + fall) * 100;
}

const numList = [
  ...tests[0],
  ...tests[1],
  ...tests[2],
];

console.log(kkk(39.86, 42.06, 47.13, 40.97));

for (let a = 0; a < numList.length; ++a) {
  for (let b = 0; b < numList.length; ++b) {
    for (let c = 0; c < numList.length; ++c) {
      for (let d = 0; d < numList.length; ++d) {
        let r = kkk(numList[a], numList[b], numList[c], numList[d]);
        if (r > 82.68 && r < 82.78) {
          console.log(numList[a], numList[b], numList[c], numList[d]);
          console.log(r.toString());
        }
      }
    }
  }
}

// let r = kkk(40.97, 42.06, 50.80, 40.92);
// let r = kkk(53.00, 40.46, 47.13, 39.86);
// console.log(r);
