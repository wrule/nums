
export
class Nums {
  public constructor(
    private nums: number[] = [],
  ) { }

  public get Nums() {
    return this.nums;
  }
}

export
function nums(nums: number[] = []) {
  return new Nums(nums);
}
