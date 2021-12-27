
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
    const weight = 2 / (nsize + 1);
    const result = Array(this.Length).fill(0);
    this.nums.forEach((num, index) => {
      let prevEMA = result[index - 1];
      if (prevEMA == null) {
        prevEMA = num;
      }
      result[index] = num * weight + prevEMA * (1 - weight);
    });
    return new Nums(result);
  }
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}
