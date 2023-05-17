import {
  numeric,
  integer,
  required,
  between,
  minLength,
  maxLength,
  minValue,
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";

export default class CampaignValidationBuilder extends ValidationBuilder {
  static validationRules = {
    name: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(255),
    },
    frequencyRatio: {
      required,
      numeric,
      between: between(0, 100),
    },
    minimumPerUserAward: {
      integer,
      min: minValue(0),
    },
    maximumPerUserAward: {
      integer,
      min: minValue(0),
    },
    rewardPoolContract: {
      required,
    },
    timeFrame: [
      {
        required,
      },
      {
        required,
      },
    ],
    weeklyEqualDistribution: {
      required,
    },
    expectedReturnOfInvestment: {
      required,
      integer,
    },
    qualityAudience: {
      required,
    },
    weightRatio: {
      required,
      numeric,
      between: between(0, 100),
    },
  };

  /**
   * @inheritDoc
   * @return Ref<Validation>
   */
  static createValidation(validationObject) {
    return useVuelidate(
      CampaignValidationBuilder.validationRules,
      validationObject,
      { $autoDirty: true }
    );
  }
}
