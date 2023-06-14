import { helpers, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";

export default class CampaignStep2ValidationBuilder extends ValidationBuilder {
  static validationRules = {
    network: {
      required,
    },
    product: {
      required: helpers.withMessage(
        required.$message,
        /**
         * @param {any} value
         * @param {CampaignFormObject} vm
         */
        (value, vm) => {
          if (vm.advanced) {
            return true;
          }

          return required.$validator(value, vm);
        }
      ),
    },
    tags: {
      required,
    },
  };

  /**
   * @inheritDoc
   * @return Ref<Validation>
   */
  static createValidation(validationObject) {
    return useVuelidate(
      CampaignStep2ValidationBuilder.validationRules,
      validationObject,
      { $autoDirty: true }
    );
  }
}
