import Entity from "@/store/entity/Entity";
import moment from "moment";

export default class Campaign extends Entity {
  name: string = "";
  rewardPool: number = 0;
  timeFrameFrom: Date = moment().toDate();
  timeFrameTill: Date = moment().toDate();
  frequencyRatioDaily: number = 1;
  frequencyRatioWeekly: number = 2/3;
  frequencyRatioMonthly: number = 1/3;
  weeklyEqualDistribution: boolean = false;
  expectedRoi: number = 0;
}
