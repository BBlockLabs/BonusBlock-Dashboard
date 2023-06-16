import ActivityDto from "@/common/dto/ActivityDto.js";

export default class RewardedActivityDto {
  /**
   * @type {ActivityDto | null}
   */
  productActivity = new ActivityDto();

  /**
   * @type {ActionDto|null}
   */
  productActivityAction = null;

  /**
   * @type {String | null}
   */
  minTrxLimit = "0";

  /**
   * @type {String | null}
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
   * @type {ActivityDto | null}
   */
  vault = new ActivityDto();
  /**
   * @type {string}
   */
  minimumDepositLimit = "0";
  /**
   * @type {string}
   */
  depositAmount = "0";
  /**
   * @type {boolean}
   */
  newVaultsOnly = false;
  /**
   * @type {number}
   */
  vaultCount = 1;
  /**
   * @type {string}
   */
  holdingAmount = "0";
  /**
   * @type {number}
   */
  holdingPeriod = 1;
  /**
   * @type {string}
   */
  preDate = "";
  /**
   * @type {string}
   */
  postDate = "";
}
