
import { nums } from './index';

const data = Array(365 * 8).fill(0).map(() => Math.random() * 100000);
const dataNums = nums(data);

const oldTime = Number(new Date());
for (let i = 0; i < 120; ++i) {
  for (let j = 0; j < 120; ++j) {
    const a = dataNums.RSVX(10);
  }
}
console.log(Number(new Date()) - oldTime);

console.log('结束');

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
// console.log(b.RSV(9));
// console.log(b.KDJ(9, 3, 3).K);
