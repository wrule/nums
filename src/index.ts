
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

  public min() {
    return Math.min(...this.nums);
  }

  public max() {
    return Math.max(...this.nums);
  }

  /**
   * 数组求方差
   * @returns 方差
   */
   public variance() {
    const avg = this.avg();
    let varianceSum = 0;
    this.nums.forEach((num) => varianceSum += Math.pow(num - avg, 2));
    return varianceSum / this.nums.length;
  }

  /**
   * 数组求标准差
   * @returns 标准差
   */
  public standardDeviation() {
    return Math.sqrt(this.variance());
  }

  public slice(start?: number, end?: number) {
    return nums(this.nums.slice(start, end));
  }

  public unshift(...items: number[]) {
    return this.nums.unshift(...items);
  }

  public leftPad(nums: number[]) {
    this.unshift(...nums);
    return this;
  }

  public normalSize(
    size: number,
  ) {
    return size < 1 ? 1 : Math.floor(size);
  }

  /**
   * 移动平均（与TradingView一致）
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
   * 指数移动平均（与TradingView一致）
   * @param size 尺度
   * @returns 结果Nums
   */
  public EMA(size: number) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    let prevEMA = this.nums[0];
    this.nums.forEach((num, index) => {
      const weight = index >= nsize ? 2 / (nsize + 1) : 1 / (index + 1);
      const newEMA = num * weight + prevEMA * (1 - weight);
      result[index] = newEMA;
      prevEMA = newEMA;
    });
    return new Nums(result);
  }

  /**
   * 指数加权移动平均（与TradingView一致）
   * @param size 尺度
   * @returns 结果Nums
   */
  public RMA(size: number) {
    const nsize = this.normalSize(size);
    const result = Array(this.Length).fill(0);
    let prevRMA = this.nums[0];
    this.nums.forEach((num, index) => {
      const dsize = index >= nsize - 1 ? nsize : index + 1;
      const newRMA = (prevRMA * (dsize - 1) + num) / dsize;
      result[index] = newRMA;
      prevRMA = newRMA;
    });
    return nums(result);
  }

  /**
   * 异同平滑平均（与TradingView一致）
   * @param fast 快尺度
   * @param slow 慢尺度
   * @param smooth 平滑
   * @returns DIF，DEA，MACD
   */
  public MACD(
    fast: number,
    slow: number,
    smooth: number,
  ) {
    const fastEMA = this.EMA(fast).nums;
    const slowEMA = this.EMA(slow).nums;
    const dif = fastEMA.map((num, index) => num - slowEMA[index]);
    const dea = nums(dif).slice(slow - 1).EMA(smooth).nums;
    dea.unshift(...dif.slice(0, slow - 1));
    const macd = dif.map((num, index) => num - dea[index]);
    return {
      DIF: nums(dif),
      DEA: nums(dea),
      MACD: nums(macd),
    };
  }

  /**
   * 异同平滑平均（纯EMA）
   * @param fast 快尺度
   * @param slow 慢尺度
   * @param smooth 平滑
   * @returns DIF，DEA，MACD
   */
  public MACD_EMA(
    fast: number,
    slow: number,
    smooth: number,
  ) {
    const fastEMA = this.EMA(fast).nums;
    const slowEMA = this.EMA(slow).nums;
    const dif = fastEMA.map((num, index) => num - slowEMA[index]);
    const dea = nums(dif).EMA(smooth).nums;
    const macd = dif.map((num, index) => num - dea[index]);
    return {
      DIF: nums(dif),
      DEA: nums(dea),
      MACD: nums(macd),
    };
  }

  /**
   * 异同平滑平均（纯MA）
   * @param fast 快尺度
   * @param slow 慢尺度
   * @param smooth 平滑
   * @returns DIF，DEA，MACD
   */
  public MACD_MA(
    fast: number,
    slow: number,
    smooth: number,
  ) {
    const fastMA = this.MA(fast).nums;
    const slowMA = this.MA(slow).nums;
    const dif = fastMA.map((num, index) => num - slowMA[index]);
    const dea = nums(dif).MA(smooth).nums;
    const macd = dif.map((num, index) => num - dea[index]);
    return {
      DIF: nums(dif),
      DEA: nums(dea),
      MACD: nums(macd),
    };
  }

  /**
   * 未成熟随机
   * @param minNums 最小Nums
   * @param maxNums 最大Nums
   * @param size 尺度
   * @returns 结果Nums
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
        if (minNums.nums[i] < min) {
          min = minNums.nums[i];
        }
        if (maxNums.nums[i] > max) {
          max = maxNums.nums[i];
        }
      }
      result[index] = (num - min) / ((max - min) || 1) * 100;
    });
    return nums(result);
  }

  /**
   * 未成熟随机（扁平）
   * @param size 尺度
   * @returns 结果Nums
   */
  public RSV_FLAT(size: number) {
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
        if (this.nums[i] < min) {
          min = this.nums[i];
        }
        if (this.nums[i] > max) {
          max = this.nums[i];
        }
      }
      result[index] = (num - min) / ((max - min) || 1) * 100;
    });
    return nums(result);
  }

  /**
   * KD指标
   * @param minNums 最小Nums
   * @param maxNums 最大Nums
   * @param RSVSize RSV尺度
   * @param KSize K尺度
   * @param DSize D尺度
   * @returns K，D
   */
  public KD(
    minNums: Nums,
    maxNums: Nums,
    RSVSize: number = 9,
    KSize: number = 3,
    DSize: number = 3,
  ) {
    const RSVNums = this.RSV(minNums, maxNums, RSVSize);
    // const K = RSVNums.EMA(KSize, 100, 1 / DSize);
    // const D = K.EMA(DSize, 100, 1 / DSize);
    const K = RSVNums.MA(KSize);
    const D = K.MA(DSize);
    return { K, D };
  }

  /**
   * KDJ指标
   * @param minNums 最小Nums
   * @param maxNums 最大Nums
   * @param RSVSize RSV尺度
   * @param KSize K尺度
   * @param DSize D尺度
   * @returns K，D，J
   */
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

  /**
   * SKDJ指标
   * @param minNums 最小Nums
   * @param maxNums 最大Nums
   * @param RSVSize RSV尺度
   * @param KSize K尺度
   * @param DSize D尺度
   * @returns K，D，J
   */
  public SKDJ(
    minNums: Nums,
    maxNums: Nums,
    RSVSize: number,
    EMASize: number,
    KSize: number,
    DSize: number,
  ) {
    const RSVNums = this.RSV(minNums, maxNums, RSVSize);
    const EMARSVNums = RSVNums.slice(RSVSize - 1).EMA(EMASize);
    EMARSVNums.unshift(...RSVNums.slice(0, RSVSize - 1).nums);
    const K = EMARSVNums.slice(RSVSize + EMASize - 2).EMA(KSize);
    K.unshift(...EMARSVNums.slice(0, RSVSize + EMASize - 2).nums);
    const D = K.slice(RSVSize + EMASize + KSize - 3).MA(DSize);
    D.unshift(...K.slice(0, RSVSize + EMASize + KSize - 3).nums);
    const J = nums(
      K.nums.map((num, index) => num * 3 - D.nums[index] * 2)
    );
    return { K, D, J };
  }

  /**
   * 相对强弱（与TradingView一致）
   * @param size 尺度
   * @returns 结果Nums
   */
  public RSI(size: number) {
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
    const riseNums = nums(riseData).slice(1).RMA(size);
    riseNums.unshift(...(riseData[0] != null ? [riseData[0]] : []));
    const fallNums = nums(fallData).slice(1).RMA(size);
    fallNums.unshift(...(fallData[0] != null ? [fallData[0]] : []));
    const result = riseNums.nums.map((rise, index) => {
      const fall = fallNums.nums[index];
      return rise / ((rise + fall) || 1) * 100;
    });
    return nums(result);
  }

  /**
   * 相对强弱（纯RMA）
   * @param size 尺度
   * @returns 结果Nums
   */
  public RSI_RMA(size: number) {
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
    const riseNums = nums(riseData).RMA(size);
    const fallNums = nums(fallData).RMA(size);
    const result = riseNums.nums.map((rise, index) => {
      const fall = fallNums.nums[index];
      return rise / ((rise + fall) || 1) * 100;
    });
    return nums(result);
  }

  /**
   * 随机相对强弱（与TradingView一致）
   * @param RSISize RSI尺度
   * @param StochSize 随机尺度
   * @param KSize K尺度
   * @param DSize D尺度
   * @returns K，D
   */
  public StochRSI(
    RSISize: number,
    StochSize: number,
    KSize: number,
    DSize: number,
  ) {
    const stochNums = this.RSI(RSISize)
      .slice(RSISize)
      .RSV_FLAT(StochSize)
      .leftPad(Array(RSISize).fill(0));
    const K = stochNums.slice(RSISize + 1)
      .MA(KSize)
      .leftPad(stochNums.nums.slice(0, RSISize + 1));
    const D = K.slice(RSISize + KSize)
      .MA(DSize)
      .leftPad(K.nums.slice(0, RSISize + KSize));
    return { K, D };
  }

  /**
   * 随机相对强弱（与TradingView一致，KDJ）
   * @param RSISize RSI尺度
   * @param StochSize 随机尺度
   * @param KSize K尺度
   * @param DSize D尺度
   * @returns K，D，J
   */
  public StochRSI_KDJ(
    RSISize: number,
    StochSize: number,
    KSize: number,
    DSize: number,
  ) {
    const stochNums = this.RSI(RSISize)
      .slice(RSISize)
      .RSV_FLAT(StochSize)
      .leftPad(Array(RSISize).fill(0));
    const K = stochNums.slice(RSISize + 1)
      .MA(KSize)
      .leftPad(stochNums.nums.slice(0, RSISize + 1));
    const D = K.slice(RSISize + KSize)
      .MA(DSize)
      .leftPad(K.nums.slice(0, RSISize + KSize));
    const J = nums(K.nums.map((num, index) => num * 3 - D.nums[index] * 2));
    return { K, D, J };
  }

  /**
   * 随机相对强弱（纯净版）
   * @param RSISize RSI尺度
   * @param StochSize 随机尺度
   * @param KSize K尺度
   * @param DSize D尺度
   * @returns K，D
   */
  public StochRSI_PURE(
    RSISize: number,
    StochSize: number,
    KSize: number,
    DSize: number,
  ) {
    const stochNums = this.RSI(RSISize).RSV_FLAT(StochSize);
    const K = stochNums.MA(KSize);
    const D = K.MA(DSize);
    return { K, D };
  }

  /**
   * 随机相对强弱（纯净版，KDJ）
   * @param RSISize RSI尺度
   * @param StochSize 随机尺度
   * @param KSize K尺度
   * @param DSize D尺度
   * @returns K，D，J
   */
  public StochRSI_PURE_KDJ(
    RSISize: number,
    StochSize: number,
    KSize: number,
    DSize: number,
  ) {
    const stochNums = this.RSI(RSISize).RSV_FLAT(StochSize);
    const K = stochNums.MA(KSize);
    const D = K.MA(DSize);
    const J = nums(K.nums.map((num, index) => num * 3 - D.nums[index] * 2));
    return { K, D, J };
  }
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}
