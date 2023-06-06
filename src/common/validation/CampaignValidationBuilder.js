import {
  between,
  helpers,
  integer,
  maxLength,
  minLength,
  minValue,
  numeric,
  required,
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";
import store from "@/state/store.js";
import moment from "moment";

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
    rewardPoolTokenCount: {
      required,
      is500Dolars: helpers.withMessage(
        "Must be at minimum value of 500$",
        (value, campaignFormObject) => {
          const contract = store.getters["Contract/getContract"](
            campaignFormObject.rewardPoolContract
          );

          if (contract === null) {
            return true;
          }

          const conversionRate = store.getters["ConversionRate/findPair"](
            contract.currencyName,
            "USD"
          );

          if (conversionRate === null) {
            return true;
          }

          const minAmount =
            store.getters["ConversionRate/getMinRewardPoolAmount"]();

          return (
            (value * conversionRate.rate) /
              Math.pow(10, contract.decimalSpaces) >=
            minAmount
          );
        }
      ),
    },
    timeFrame: [
      {
        required,
        minValue: helpers.withMessage(
          "Start date must be in the future",
          (value) => {
            return value > new Date();
          }
        ),
      },
      {
        required,
        maxValue: helpers.withMessage(
          "End date must be in the future and at least after a week from the start date",
          (value, vm) => {
            return (
              value > new Date() &&
              value >= moment(vm[0]).add(7, "days").toDate()
            );
          }
        ),
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
