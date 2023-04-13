import {
  numeric,
  integer,
  required,
  between,
  minLength,
  maxLength,
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
    frequencyRatioDaily: {
      required,
      numeric,
      between: between(0, 1),
    },
    frequencyRatioWeekly: {
      required,
      numeric,
      between: between(0, 1),
    },
    frequencyRatioMonthly: {
      required,
      numeric,
      between: between(0, 1),
    },
    rewardPoolTokenCount: {
      required,
      integer,
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
