export class CampaignAnalyticsDto {
  /**
   * @type {Array<DailyCountDto>}
   */
  interactions = [];
  /**
   * @type {Array<DailyCountDto>}
   */
  newUsers = [];
  /**
   * @type {Array<DailyCountDto>}
   */
  volume = [];
  /**
   * @type {number}
   */
  campaignCost = 0;
  /**
   * @type {number}
   */
  interactionsToday = 0;
  /**
   * @type {number}
   */
  uniqueUsers = 0;
  /**
   * @type {number}
   */
  possibleBotUsers = 0;
  /**
   * @type {number}
   */
  RetentionCount = 0;
  /**
   * @type {number}
   */
  rewardsDistributed = 0;
  /**
   * @type {number}
   */
  totalGasUsed = 0;
  /**
   * @type {number}
   */
  totalVolume = 0;
}
