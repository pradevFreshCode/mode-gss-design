export class UtilsNumbers {
  public static GetDigits(num: number, digitsCount: number = null): number {
    if (!num) {
      return 0;
    }
    if (digitsCount === 0) {
      return 0;
    }
    let str = '' + num;
    const pointIndex = str.indexOf('.');
    if (pointIndex === -1) {
      return 0;
    }
    str = (digitsCount && digitsCount > 0)
      ? str.slice(pointIndex, pointIndex + digitsCount + 1)
      : str.slice(pointIndex);
    return +str;
  }

  public static GetInteger(num: number) {
    if (!num) {
      return 0;
    }
    return num > 0 ? Math.floor(num) : Math.ceil(num);
  }
}
