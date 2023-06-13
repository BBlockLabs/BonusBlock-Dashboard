import { integer, required, minValue, helpers, requiredIf } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";
import ActivityType from "@/common/ActivityType.js";
import ActivityAction from "@/common/ActivityAction.js";
import { toRaw } from "vue";

export default class RewardedActivityValidationBuilder extends ValidationBuilder {
  static validationRules = {
    activityAction: {
      required,
      inActionOption: (value) => {
        if (!value) {
          return true;
        }

        return Object.values(ActivityAction).includes(toRaw(value));
      },
    },
    type: {
      inTypeOption: (value) => {
        if (!value) {
          return true;
        }

        return Object.values(ActivityType).includes(toRaw(value));
      },
      required: requiredIf(function (value, form) {
        return (form.activityAction && form.activityAction.name === ActivityAction.SWAP.name) && !form.advanced;
      }),
    },
    activity: {
      required: requiredIf(function (value, form) {
        return (form.activityAction && form.activityAction.name === ActivityAction.SWAP.name) || form.advanced;
      }),
    },
    actions: {
      required: requiredIf(function (value, form) {
        return (form.activityAction && form.activityAction.name === ActivityAction.INTERACT.name);
      }),
    },
    minimumTransactionLimit: {
      integer,
      minValue: new minValue(0),
    },
    minimumTransactionCount: {
      integer,
      minValue: new minValue(0),
    },
    minimumDepositLimit: {
      // optional, >0
      minValue: new minValue(0),
    },
    depositAmount: {
      // optional, >0
      minValue: new minValue(0),
    },
    vaultCount: {
      // required, >=1
      required: requiredIf(function (value, form) {
        return form.activityAction && form.activityAction.name === ActivityAction.CREATE_VAULT.name;
      }),
      integer,
      minValue: new minValue(1),
    },
    holdingAmount: {
      // optional, >0
      minValue: new minValue(0),
    },
    holdingPeriod: {
      // required, >=1
      required: requiredIf(function (value, form) {
        return form.activityAction && form.activityAction.name === ActivityAction.HOLDING.name;
      }),
      minValue: new minValue(1),
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
