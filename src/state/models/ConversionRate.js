import Model from "@/state/models/Model.js";
import moment from "moment";

export default class ConversionRate extends Model {
  /**
   * From denom
   *
   * @type {string}
   */
  from = "-";

  /**
   * To denom
   *
   * @type {string}
   */
  to = "-";

  /**
   * 1 from / 1 to
   *
   * @type {number}
   */
  rate = 0;

  /**
   * @type {moment.Moment}
   */
  time = moment();

  /**
   * @param {ConversionRateDto} dto
   * @return {ConversionRate}
   */
  static fromDto(dto) {
    const rate = new ConversionRate();

    rate.from = dto.tickerFrom;
    rate.to = dto.tickerTo;
    rate.time = moment(dto.tradeDate);
    rate.rate = dto.rate;

    return rate;
  }
}
