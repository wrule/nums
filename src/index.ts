
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

  /**
   * 移动平均
   * @param size 尺度
   * @returns 结果Nums
   */
  public MA(size: number) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    let sum = 0;
    this.nums.forEach((num, index) => {
      const length = index >= nsize - 1 ? nsize : index + 1;
      sum -= this.nums[index - nsize] || 0;
      sum += num;
      result[index] = sum / length;
    });
    return nums(result);
  }

  /**
   * 指数移动平均
   * @param size 尺度
   * @param smooth 平滑
   * @returns 结果Nums
   */
  public EMA(
    size: number,
    smooth: number = 2,
  ) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    let prevEMA = this.nums[0];
    this.nums.forEach((num, index) => {
      const weight = index >= nsize ? smooth / (nsize + 1) : 1 / (index + 1);
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
      const dsize = index >= nsize ? nsize : (index || 1);
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
    const DEANums = new Nums(DIFNums).EMA(size, 2, slow - 1).nums;
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

  /**
   * 未成熟随机值
   * @param minNums 
   * @param maxNums 
   * @param size 
   * @returns 
   */
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

  /**
   * 未成熟随机值（扁平）
   * @param size 
   * @returns 
   */
  public RSV_FLAT(
    size: number,
  ) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    this.nums.forEach((num, index) => {
      let startIndex = index + 1 - nsize;
      if (startIndex < 0) {
        startIndex = 0;
      }
      let min = this.nums[startIndex];
      let max = this.nums[startIndex];
      for (let i = startIndex + 1; i < index + 1; ++i) {
        const currentMinNum = this.nums[i];
        const currentMaxNum = this.nums[i];
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

  /**
   * KD指标
   * @param minNums 
   * @param maxNums 
   * @param RSVSize 
   * @param KSize 
   * @param DSize 
   * @returns 
   */
  public KD(
    minNums: Nums,
    maxNums: Nums,
    RSVSize: number = 9,
    KSize: number = 3,
    DSize: number = 3,
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

  public RSI(
    size: number,
    RMAInit?: number,
  ) {
    const nsize = this.normalSize(size);
    const riseData = Array(this.Length).fill(0);
    const fallData = Array(this.Length).fill(0);
    for (let i = 1; i < this.Length; ++i) {
      const diff = this.nums[i] - this.nums[i - 1];
      if (diff > 0) {
        riseData[i] = diff;
      } else {
        fallData[i] = -diff;
      }
    }
    const riseNums = nums(riseData).RMA(nsize, RMAInit);
    const fallNums = nums(fallData).RMA(nsize, RMAInit);
    const result = riseNums.nums.map((rise, index) => {
      const fall = fallNums.nums[index];
      return rise / ((rise + fall) || 1) * 100;
    });
    return nums(result);
  }

  public SRSI(
    size: number,
    RMAInit?: number,
    RSISize?: number,
  ) {
    const RSINums = this.RSI(RSISize != null ? RSISize : size, RMAInit);
    return RSINums.RSV_FLAT(size);
  }

  // public ROC() {

  // }
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}
