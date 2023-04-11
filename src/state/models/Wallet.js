import Model from "@/state/models/Model";

export class Wallet extends Model {
  /**
   * @type {String}
   */
  id = "";

  /**
   * @type {String}
   */
  address = "";

  /**
   * @type {Number}
   */
  balance = 0;

  /**
   * @type {String}
   */
  userId;

  /**
   * @param {{
   *  id: String,
   *  address: String,
   *  balance: Number,
   *  userId: String,
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });
  }
}

export default Wallet;
