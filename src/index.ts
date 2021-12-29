
export
class Nums {
  public constructor(
    private nums: number[] = [],
  ) { }

  public get Nums() {
    return this.nums;
  }

  public get Length() {
    return this.nums.length;
  }

  public sum() {
    let result = 0;
    this.nums.forEach((num) => result += num);
    return result;
  }

  public avg() {
    return this.sum() / (this.Length || 1);
  }

  public normalSize(
    size: number,
  ) {
    return size < 1 ? 1 : Math.floor(size);
  }

  public MA(size: number) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    let sum = 0;
    this.nums.forEach((num, index) => {
      const discardIndex = index - nsize;
      const length = index < nsize - 1 ? index + 1 : nsize;
      sum += num;
      if (discardIndex >= 0) {
        sum -= this.nums[discardIndex];
      }
      result[index] = sum / length;
    });
    return nums(result);
  }

  public EMA(
    size: number,
    EMAInit?: number,
    WeightInit?: number,
  ) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    const weight = WeightInit != null ? WeightInit : 2 / (nsize + 1);
    let prevEMA = EMAInit != null ? EMAInit : this.nums[0];
    this.nums.forEach((num, index) => {
      const newEMA = num * weight + prevEMA * (1 - weight);
      result[index] = newEMA;
      prevEMA = newEMA;
    });
    return new Nums(result);
  }

  public RMA(
    size: number,
    RMAInit?: number,
  ) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    let prevRMA = RMAInit != null ? RMAInit : this.nums[0];
    this.nums.forEach((num, index) => {
      const dsize = index >= nsize - 1 ? nsize : index + 1;
      const newRMA = (prevRMA * (dsize - 1) + num) / dsize;
      result[index] = newRMA;
      prevRMA = newRMA;
    });
    return nums(result);
  }

  public MACD(
    fast: number,
    slow: number,
    size: number,
  ) {
    const fastNums = this.EMA(fast).nums;
    const slowNums = this.EMA(slow).nums;
    const DIFNums = fastNums.map((num, index) => num - slowNums[index]);
    const DEANums = new Nums(DIFNums).EMA(size).nums;
    const MACDNums = DIFNums.map((num, index) => num - DEANums[index]);
    return {
      DIF: new Nums(DIFNums),
      DEA: new Nums(DEANums),
      MACD: new Nums(MACDNums),
    };
  }

  public MACD_MA(
    fast: number,
    slow: number,
    size: number,
  ) {
    const fastNums = this.MA(fast).nums;
    const slowNums = this.MA(slow).nums;
    const DIFNums = fastNums.map((num, index) => num - slowNums[index]);
    const DEANums = new Nums(DIFNums).MA(size).nums;
    const MACDNums = DIFNums.map((num, index) => num - DEANums[index]);
    return {
      DIF: new Nums(DIFNums),
      DEA: new Nums(DEANums),
      MACD: new Nums(MACDNums),
    };
  }

  public RSV(
    minNums: Nums,
    maxNums: Nums,
    size: number,
  ) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    this.nums.forEach((num, index) => {
      let startIndex = index + 1 - nsize;
      if (startIndex < 0) {
        startIndex = 0;
      }
      let min = minNums.nums[startIndex];
      let max = maxNums.nums[startIndex];
      for (let i = startIndex + 1; i < index + 1; ++i) {
        const currentMinNum = minNums.nums[i];
        const currentMaxNum = maxNums.nums[i];
        if (currentMinNum < min) {
          min = currentMinNum;
        }
        if (currentMaxNum > max) {
          max = currentMaxNum;
        }
      }
      result[index] = (num - min) / ((max - min) || 1) * 100;
    });
    return nums(result);
  }

  public KD(
    minNums: Nums,
    maxNums: Nums,
    RSVSize: number,
    KSize: number,
    DSize: number,
  ) {
    const RSVNums = this.RSV(minNums, maxNums, RSVSize);
    const K = RSVNums.EMA(KSize, 100, 1 / DSize);
    const D = K.EMA(DSize, 100, 1 / DSize);
    return { K, D };
  }

  public KDJ(
    minNums: Nums,
    maxNums: Nums,
    RSVSize: number,
    KSize: number,
    DSize: number,
  ) {
    const { K, D } = this.KD(
      minNums,
      maxNums,
      RSVSize,
      KSize,
      DSize,
    );
    const J = nums(
      K.nums.map((num, index) => num * 3 - D.nums[index] * 2)
    );
    return { K, D, J };
  }

  public SKDJ(
    minNums: Nums,
    maxNums: Nums,
    RSVSize: number,
    KSize: number,
    DSize: number,
  ) {
    let { D } = this.KDJ(minNums, maxNums, RSVSize, KSize, DSize);
    const K = D;
    D = K.EMA(DSize, 100, 1 / DSize);
    const J = nums(
      K.nums.map((num, index) => num * 3 - D.nums[index] * 2)
    );
    return { K, D, J };
  }

  public RS(
    openNums: Nums,
    size: number,
  ) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    this.nums.forEach((num, index) => {
      let startIndex = index + 1 - nsize;
      if (startIndex < 0) {
        startIndex = 0;
      }
      let riseSum = 0, fallSum = 0;
      for (let i = startIndex; i < index + 1; ++i) {
        const diff = this.nums[i] - openNums.nums[i];
        if (diff > 0) {
          riseSum += diff;
        } else {
          fallSum += -diff;
        }
      }
      // console.log(riseSum, fallSum);
      result[index] = (riseSum / nsize) / (fallSum / nsize) * 100;
    });
    return nums(result);
  }

  public RSI(
    size: number,
  ) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    this.nums.forEach((num, index) => {
      result[index] = 0;
    });
    return nums(result);
  }
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}


// 100 - 100 / (1 + A / B)
// A / (A + B) * 100

// 苹果 10元
// 橘子 5元
// 向LP注入10个苹果（价值100元） 20个橘子（价值100元）
// a = 10，b = 20，a * b = k = 200
// 外部市场价格不变，现有人拿2个橘子换苹果
// (10 - x) * (20 + 2) = 200
// x = 0.9090 给他 0.9090 个苹果
// a = 9.0909，b = 22，a * b = 200
// 9.0909 * 10 + 22 * 5 = 200.909 盈利0.909

// 外部市场橘子下跌50%，有人恐慌抛售，现有人拿8个橘子换苹果
// (9.0909 - x) * (22 + 8) = 200
// x = 2.4242 给他 2.4242 个苹果
// a = 6.6666，b = 30，a * b = 200
// 资产 6.6666 * 10 + 30 * 2.5 = 141.666 亏损 59.242
// 若不参与DEFT挖矿，长持，资产为10 * 10 + 20 * 2.5 = 150
// 无常损失为 150 - 141.666 = 8.334