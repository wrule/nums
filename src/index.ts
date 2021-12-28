
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

  public EMA(size: number) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    const weight = 2 / (nsize + 1);
    this.nums.forEach((num, index) => {
      let prevEMA = result[index - 1];
      if (prevEMA == null) {
        prevEMA = num;
      }
      result[index] = num * weight + prevEMA * (1 - weight);
    });
    return new Nums(result);
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

  public RSV(size: number) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    this.nums.forEach((num, index) => {
      let startIndex = index + 1 - nsize;
      if (startIndex < 0) {
        startIndex = 0;
      }
      const slice = this.nums.slice(startIndex, index + 1);
      const min = Math.min(...slice);
      const max = Math.max(...slice);
      result[index] = (num - min) / ((max - min) || 1) * 100;
    });
    return nums(result);
  }

  public RSVX(size: number) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    this.nums.forEach((num, index) => {
      let min = Infinity, max = -Infinity;
      let startIndex = index + 1 - nsize;
      if (startIndex < 0) {
        startIndex = 0;
      }
      for (let i = startIndex; i < index + 1; ++i) {
        const currentNum = this.nums[i];
        if (currentNum < min) {
          min = currentNum;
        }
        if (currentNum > max) {
          max = currentNum;
        }
      }
      result[index] = (num - min) / ((max - min) || 1) * 100;
    });
    return nums(result);
  }

  public KD() {
    // 33.33 22.22 14.81
  }

  public KDJ(
    rsvSize: number,
    ma1: number,
    ma2: number,
  ) {
    const rsvNums = this.RSV(rsvSize);
    const K = rsvNums.EMA(ma1);
    const D = K.EMA(ma2);
    const J = nums(
      K.nums.map((num, index) => num * 3 - D.nums[index] * 2)
    );
    return {
      K, D, J,
    };
  }
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}
