
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
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}
