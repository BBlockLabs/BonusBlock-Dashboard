export class Formatter {
  static byteLevels = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  /**
   * @param {BigInt} bytes
   * @param {Number} decimalPoints
   * @return {string}
   */
  static formatBytes(bytes, decimalPoints = 2) {
    let quotient = BigInt(bytes);
    let remainder = 0;
    let shifts = 0;

    while (quotient >= 1024n) {
      remainder = quotient & 1023n;
      quotient = quotient >> 10n; // same as quotient = quotient / 1024
      shifts++;
    }

    const unit = Formatter.byteLevels[shifts];

    if (remainder === 0 || remainder === 0n || decimalPoints === 0) {
      return `${quotient} ${unit}`;
    }

    remainder = (remainder * BigInt(Math.pow(10, decimalPoints))) / 1024n;

    return `${quotient}.${remainder} ${unit}`;
  }
}
