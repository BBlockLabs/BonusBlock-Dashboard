import { integer, required, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";

export default class RewardedActivityValidationBuilder extends ValidationBuilder {
  static validationRules = {
    activity: {
      required,
    },
    action: {
      required,
    },
    minimumTransactionLimit: {
      integer,
      minValue: new minValue(0),
    },
    minimumTransactionCount: {
      integer,
      minValue: new minValue(0),
    },
  };

  /**
   * @inheritDoc
   * @return Ref<Validation>
   */
  static createValidation(validationObject) {
    return useVuelidate(
      RewardedActivityValidationBuilder.validationRules,
      validationObject
    );
  }
}
