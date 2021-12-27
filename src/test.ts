
import { nums } from './index';

const data = Array(365 * 8).fill(0).map(() => Math.random() * 100000);
const dataNums = nums(data);

const oldTime = Number(new Date());
for (let i = 0; i < 120; ++i) {
  for (let j = 0; j < 120; ++j) {
    const a = dataNums.EMA(i);
    const b = dataNums.EMA(j);
  }
}
console.log(Number(new Date()) - oldTime);

console.log('结束');
