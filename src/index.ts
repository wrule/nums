
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
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}
