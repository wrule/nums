
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
    return nums(this.nums.map((num, index) => {
      let sum = num, diff = 1;
      for (; diff < nsize && index - diff >= 0; ++diff) {
        sum += this.nums[index - diff];
      }
      return sum / diff;
    }));
  }

  public EMA(size: number) {
    const nsize = this.normalSize(size);
    const weight = 2 / (nsize + 1);
    const result: number[] = [];
    this.nums.forEach((num, index) => {
      let prevEMA = result[index - 1];
      if (prevEMA == null) {
        prevEMA = num;
      }
      result.push(num * weight + prevEMA * (1 - weight));
    });
    return new Nums(result);
  }
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}
