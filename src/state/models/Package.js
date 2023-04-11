import Model from "@/state/models/Model";

export class Package extends Model {
  /**
   * @type {String}
   */
  id = "";

  /**
   * @type {String}
   */
  name = "";

  /**
   * @type {Number}
   */
  priceUHost = 0;

  /**
   * @type {Number}
   */
  pricePeriod = 0;

  /**
   * @type {Number}
   */
  ramBytes = 0;

  /**
   * @type {Number}
   */
  cpuGHz = 0;

  /**
   * @type {Number}
   */
  cpuCount = 0;

  /**
   * @type {Number}
   */
  cpuCoreCount = 0;

  /**
   * @type {Number}
   */
  storageBytes = 0;

  /**
   * @type {String}
   */
  sdkVersion = "";

  /**
   * @type {String}
   */
  kubernetesVersion = "";

  /**
   * @type {[]}
   */
  features = [];

  /**
   * @type {String}
   */
  serverId = "";

  /**
   * @type {import('@/state/models/Server').Server}
   */
  server = null;

  /**
   * @param {{
   *   id: String,
   *   name: String,
   *   priceUHost: Number,
   *   pricePeriod: Number,
   *   ramBytes: Number,
   *   cpuGHz: Number,
   *   cpuCount: Number,
   *   cpuCoreCount: Number,
   *   storageBytes: Number,
   *   sdkVersion: String,
   *   kubernetesVersion: String,
   *   features: Array,
   *   serverId: String,
   *   server: import('@/state/models/Server').Server
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });
  }
}

export default Package;
