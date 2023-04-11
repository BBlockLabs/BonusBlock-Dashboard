export default class PackageFilter {
  static get BYTES_IN_GB() {return 1073741824;}

  static get ENDORSEMENT_RECOMMENDED() {return 1;}
  static get ENDORSEMENT_OTHER() {return 2;}

  /**
   * @type {[Number, Number]|[]}
   */
  prices = [];

  /**
   * @type {Array}
   */
  region = [];

  /**
   * @type {Array}
   */
  features = [];

  /**
   * @type {String}
   */
  cpuName = '';

  /**
   * @type {[Number, Number]|[]}
   */
  cpuCount = [];

  /**
   * @type {[Number, Number]|[]}
   */
  cpuCores = [];

  /**
   * @type {[Number, Number]|[]}
   */
  cpuSpeed = [];

  /**
   * @type {[Number, Number]|[]}
   */
  ramAmount = [];

  /**
   * @type {[Number, Number]|[]}
   */
  storageAmount = [];

  /**
   * @type {Array}
   */
  storageType = [];

  /**
   * @type {ENDORSEMENT_RECOMMENDED|ENDORSEMENT_OTHER|null}
   */
  endorsement = null;

  /**
   * @return{[Number, Number]|[]}
   */
  get priceUHost() {
    if (this.prices.length === 0) {
      return [];
    }

    return [
      this.prices[0] * 1000000,
      this.prices[1] * 1000000,
    ];
  }

  /**
   * @return{[Number, Number]|[]}
   */
  get ramBytes() {
    if (this.ramAmount.length === 0) {
      return [];
    }

    return [
      this.ramAmount[0] * PackageFilter.BYTES_IN_GB,
      this.ramAmount[1] * PackageFilter.BYTES_IN_GB,
    ];
  }

  /**
   * @return{[Number, Number]|[]}
   */
  get storageBytes() {
    if (this.storageAmount.length === 0) {
      return [];
    }

    return [
      this.storageAmount[0] * PackageFilter.BYTES_IN_GB,
      this.storageAmount[1] * PackageFilter.BYTES_IN_GB,
    ];
  }
}
