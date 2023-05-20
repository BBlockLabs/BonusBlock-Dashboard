import { integer, required, minValue, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";
import ActivityType from "@/common/ActivityType.js";
import ActivityAction from "@/common/ActivityAction.js";
import { toRaw } from "vue";

export default class RewardedActivityValidationBuilder extends ValidationBuilder {
  static validationRules = {
    activity: {
      required,
    },
    action: {
      requiredIfInteract: helpers.withMessage(
        required.$message,
        (value, object) => {
          if (toRaw(object.activityAction) !== ActivityAction.INTERACT) {
            return true;
          }

          return !!value;
        }
      ),
    },
    minimumTransactionLimit: {
      integer,
      minValue: new minValue(0),
    },
    minimumTransactionCount: {
      integer,
      minValue: new minValue(0),
    },
    type: {
      inTypeOption: (value) => {
        if (!value) {
          return true;
        }

        return Object.values(ActivityType).includes(toRaw(value));
      },
    },
    activityAction: {
      required,
      inActionOption: (value) => {
        if (!value) {
          return true;
        }

        return Object.values(ActivityAction).includes(toRaw(value));
      },
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
