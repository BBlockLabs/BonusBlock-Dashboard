export class Formatter {
  static TEN = BigInt(10);
  static ZERO = BigInt(0);

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

    decimals /= Formatter.TEN ** BigInt(precision);

    while (
      remainder > Number.MAX_SAFE_INTEGER ||
      decimals > Number.MAX_SAFE_INTEGER
    ) {
      remainder /= Formatter.TEN;
      decimals /= Formatter.TEN;

      if (remainder === Formatter.ZERO || decimals === Formatter.ZERO) {
        return division.toString() + ".".padEnd(precision + 1, "0");
      }
    }

    remainder = Number(remainder);
    decimals = Number(decimals);

    remainder = Math.round(remainder / decimals).toString();

    if (remainder.length > precision) {
      division++;

      return division.toString() + ".".padEnd(precision + 1, "0");
    }

    return (
      division.toString() + "." + remainder.padStart(precision, "0")
    );
  }
}
