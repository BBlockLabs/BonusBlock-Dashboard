import { integer, required, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";

export default class RewardedActivityValidationBuilder extends ValidationBuilder {
  static validationRules = {
    minimumTransactionLimit: {
      required,
      integer,
      minValue: new minValue(0),
    },
    activity: {
      required,
    },
    action: {
      required,
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
