import ActivityDto from "@/common/dto/ActivityDto.js";

export default class RewardedActivityDto {
  /**
   * @type {ActivityDto}
   */
  productActivity = new ActivityDto();

  /**
   * @type {ActionDto|null}
   */
  productActivityAction = null;

  /**
   * @type {String}
   */
  minTrxLimit = "0";

  /**
   * @type {String}
   */
  minTrxAmount = "0";

  /**
   * @type {"ACTION_SWAP", "ACTION_INTERACT"}
   */
  action = "ACTION_SWAP";

  /**
   * @type {"TYPE_DEX" | "TYPE_POOL" | "TYPE_ROUTER"}
   */
  actionType = "TYPE_DEX";

  /**
   * @type {string}
   */
  vault = "";
  /**
   * @type {number}
   */
  minimumDepositLimit = 0;
  /**
   * @type {number}
   */
  depositAmount = 0;
  /**
   * @type {boolean}
   */
  newVaultsOnly = false;
  /**
   * @type {number}
   */
  vaultCount = 1;
  /**
   * @type {number}
   */
  holdingAmount = 0;
  /**
   * @type {number}
   */
  holdingPeriod = 1;
  /**
   * @type {boolean}
   */
  useFiltering = false;
  /**
   * @type {string}
   */
  filteringType = "";
}
