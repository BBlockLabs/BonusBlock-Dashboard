import Entity from "@/store/entity/Entity";

export default class RewardedActivity extends Entity {
  product: string = "";
  action: string = "";
  minimumAmount: number = 1;
  bonusAmount: number = 1;
}
