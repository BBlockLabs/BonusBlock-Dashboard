import type { Moment } from "moment/moment";

export default class CalculationResultDto {
  periodFrom: Moment;
  periodTill: Moment;
  preview: boolean;
  staking: number;
  frequency: number;
  activity: number;
  rewardPoints: number;
  reward: number;
  network: string;
}
