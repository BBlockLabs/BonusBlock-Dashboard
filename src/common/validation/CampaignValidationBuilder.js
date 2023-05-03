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
    frequencyRatioDaily: {
      required,
      numeric,
      between: between(1, 100),
    },
    frequencyRatioWeekly: {
      required,
      numeric,
      between: between(1, 100),
    },
    frequencyRatioMonthly: {
      required,
      numeric,
      between: between(1, 100),
    },
    minimumPerUserAward: {
      integer,
      min: minValue(0),
    },
    maximumPerUserAward: {
      integer,
      min: minValue(0),
    },
    /*rewardPoolTokenCount: {
      required,
      integer,
      min: minValue(1),
    },*/
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
