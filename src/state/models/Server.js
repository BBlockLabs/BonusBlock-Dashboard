import Model from "@/state/models/Model";

export class Server extends Model {
  /**
   * @type {String}
   */
  id = "";

  /**
   * @type {String}
   */
  name = "";

  /**
   * @type {String|null}
   */
  url = null;

  /**
   * @type {Number}
   */
  leasing = getRandomInt(10, 500);

  /**
   * @type {Number}
   */
  totalLeases = getRandomInt(500, 1000);

  /**
   * @type {Blob|null}
   */
  icon = null;

  /**
   * @type {String}
   */
  ip = "0.0.0.0";

  /**
   * @type {String}
   */
  address = "";

  /**
   * @type {Number}
   */
  ramBytes = 0;

  /**
   * @type {Number}
   */
  usedRamBytes = getRandomInt(128000000000, 1024000000000);

  /**
   * @type {String}
   */
  ramType = "";

  /**
   * @type {String}
   */
  cpuName = "";

  /**
   * @type {Number}
   */
  cpuCount = 0;

  /**
   * @type {Number}
   */
  usedCpuCount = getRandomInt(10, 50);

  /**
   * @type {Number}
   */
  storageBytes = 0;

  /**
   * @type {Number}
   */
  usedStorageBytes = getRandomInt(128000000000, 1024000000000);

  /**
   * @type {Number}
   */
  trafficBytes = 0;

  /**
   * @type {Number}
   */
  uplinkBits = 0;

  /**
   * @type {[]}
   */
  features = [];

  /**
   * @type {String}
   */
  storageDriveType = "";

  /**
   * @type {String}
   */
  platform = "";

  /**
   * @type {Object}
   */
  location = {};

  /**
   * @type {String}
   */
  organizationId = null;

  /**
   * @type {import('@/state/models/Organization').Organization}
   */
  organization = null;

  /**
   * @param {{
   *  id: String,
   *  name: String,
   *  url: String|null,
   *  leasing: Number,
   *  totalLeases: Number,
   *  icon: Blob|null,
   *  ip: String,
   *  address: String,
   *  ramBytes: Number,
   *  ramType: String,
   *  cpuName: String,
   *  usedRamBytes: Number,
   *  cpuCount: Number,
   *  usedCpuCount: Number,
   *  storageBytes: Number,
   *  usedStorageBytes: Number,
   *  trafficBytes: Number,
   *  uplinkBits: Number,
   *  features: Array,
   *  storageDriveType: String,
   *  platform: Array,
   *  location: Object,
   *  organizationId: String,
   *  organization: import('@/state/models/Server').Server
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Server;
