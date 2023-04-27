export class Formatter {
  static TEN = BigInt(10);
  static ZERO = BigInt(0);
  static FIVE = BigInt(5);

  /**
   *
   * @param {BigInt} sum
   * @param {Contract} contract
   * @param {number} precision
   * @return {string}
   */
  static token(sum, contract, precision = 2) {
    const numberString = Formatter.bigIntToPrecision(
      sum,
      contract.decimalSpaces,
      precision
    );

    return `${numberString} ${contract.denom}`;
  }

  /**
   * @param {BigInt} sum
   * @param {number} decimalSpaces
   * @param {number} precision
   * @return {string}
   */
  static bigIntToPrecision(sum, decimalSpaces = 6, precision = 2) {
    sum = BigInt(sum);

    let decimals = Formatter.TEN ** BigInt(decimalSpaces);

    let remainder = sum % decimals;
    let division = sum / decimals;

    if (remainder === Formatter.ZERO) {
      return division.toString() + ".".padEnd(precision + 1, "0");
    }

    if (precision >= decimalSpaces) {
      return (
        division.toString() +
        "." +
        remainder.toString().padStart(precision, "0")
      );
    }

    // Ugly, but works

    let precisionDifference = decimalSpaces - precision;

    if (precisionDifference <= 0) {
      return (
        division.toString() +
        "." +
        remainder.toString().padStart(precision, "0")
      );
    }

    // Round and remove numbers smaller than precision
    for (precisionDifference; precisionDifference > 0; precisionDifference--) {
      remainder += Formatter.FIVE;
      remainder /= Formatter.TEN;
    }

    // Case when rounding .999 goes to 1.000
    if (remainder.toString().length > precision) {
      return (++division).toString() + ".".padEnd(precision + 1, "0");
    }

    return (
      division.toString() + "." + remainder.toString().padStart(precision, "0")
    );
  }
}
