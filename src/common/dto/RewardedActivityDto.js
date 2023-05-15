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
}
