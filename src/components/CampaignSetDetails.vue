<template>
  <el-form
    label-position="top"
    @submit.prevent="() => $emit('submit', ...arguments)"
  >
    <h1 class="mt-0"><b>Set your Campaign Details</b></h1>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['name'])"
      label="Campaign Name"
    >
      <el-input v-model="campaignFormObject.name" placeholder="Campaign Name" />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['timeFrame'])
      "
    >
      <el-col class="w-100">
        <label class="el-form-item__label">
          Campaign Period, date & time (UTC+2)
          <el-tooltip
            effect="light"
            content="Prompts info"
            placement="top-start"
            :offset="-20"
          >
            <el-icon class="tooltip-icon">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </label>
        <el-row>
          <el-date-picker
            v-model="campaignFormObject.timeFrame"
            format="YYYY/MM/DD HH:mm"
            type="datetimerange"
          />
        </el-row>
      </el-col>
    </el-form-item>

    <h1>Set rewards</h1>
    <!--    v-bind="
    ValidationHelper.getFormItemErrorAttributes(
    validate['rewardPoolTokenCount']
    )
    "-->
    <el-form-item class="">
      <el-row class="w-100" :gutter="12">
        <el-col :span="12">
          <el-form-item
            v-bind="
              ValidationHelper.getFormItemErrorAttributes(
                validate['rewardPoolContract']
              )
            "
          >
            <template #label>
              <span>
                <label class="el-form-item__label">
                  Reward Pool
                  <el-tooltip
                    effect="light"
                    content="Prompts info"
                    placement="top-start"
                    :offset="-20"
                  >
                    <el-icon class="tooltip-icon">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </label>
              </span>
            </template>

            <contract-select-field
              v-model="campaignFormObject.rewardPoolContract"
              class="w-100"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item>
            <template #label>
              <span>
                <label class="el-form-item__label">
                  Reward Pool Token amount
                  <el-tooltip
                    effect="light"
                    content="Prompts info"
                    placement="top-start"
                    :offset="-20"
                  >
                    <el-icon class="tooltip-icon">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </label>
              </span>
            </template>
          </el-form-item>

          <token-input
            v-model="campaignFormObject.rewardPoolTokenCount"
            :contract="contract"
          />
        </el-col>
      </el-row>
    </el-form-item>

    <h3>
      Reward frequency ratio
      <el-tooltip
        effect="light"
        content="
        Determine how important is the interaction count with the product.
        For example, If you set 90% in Daily, 7% Weekly, and 3% Monthly, users that connect with your campaign daily will get the highest incentives."
        placement="top-start"
        :offset="-20"
      >
        <el-icon class="tooltip-icon"><InfoFilled /></el-icon>
      </el-tooltip>
    </h3>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['frequencyRatioDaily']
        )
      "
      label="Daily"
    >
      <el-input v-model="frequencyRatioDaily" placeholder="50">
        <template #suffix>%</template>
      </el-input>
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['frequencyRatioWeekly']
        )
      "
      label="Weekly"
    >
      <el-input v-model="frequencyRatioWeekly" placeholder="30">
        <template #suffix>%</template>
      </el-input>
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['frequencyRatioMonthly']
        )
      "
      label="Monthly"
    >
      <el-input v-model="frequencyRatioMonthly" placeholder="20">
        <template #suffix>%</template>
      </el-input>
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['minimumPerUserAward']
        )
      "
    >
      <label class="el-form-item__label">
        Minimum reward per user
        <el-tooltip
          effect="light"
          content="Prompts info"
          placement="top-start"
          :offset="-50"
        >
          <el-icon class="tooltip-icon">
            <info-filled />
          </el-icon>
        </el-tooltip>
      </label>
      <token-input
        v-model="campaignFormObject.minimumPerUserAward"
        :disabled="
          !campaignFormObject.rewardPoolContract ||
          !campaignFormObject.rewardPoolTokenCount
        "
        :contract="contract"
      />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['maximumPerUserAward']
        )
      "
    >
      <label class="el-form-item__label">
        Maximum reward per user
        <el-tooltip
          effect="light"
          content="Prompts info"
          placement="top-start"
          :offset="-50"
        >
          <el-icon class="tooltip-icon">
            <info-filled />
          </el-icon>
        </el-tooltip>
      </label>
      <token-input
        v-model="campaignFormObject.maximumPerUserAward"
        :disabled="
          !campaignFormObject.rewardPoolContract ||
          !campaignFormObject.rewardPoolTokenCount
        "
        :contract="contract"
      />
    </el-form-item>

    <h1>Other</h1>

    <el-row :gutter="12">
      <el-col :span="13">
        <el-form-item
          v-bind="
            ValidationHelper.getFormItemErrorAttributes(
              validate['expectedReturnOfInvestment']
            )
          "
          label="Expected ROI"
        >
          <el-input v-model="campaignFormObject.expectedReturnOfInvestment" />
        </el-form-item>
      </el-col>

      <el-col :span="11">
        <el-form-item class="m-0">
          <el-switch
            v-model="campaignFormObject.weeklyEqualDistribution"
            active-text="Weekly equal distribution"
          />
        </el-form-item>

        <el-form-item>
          <el-switch
            v-model="campaignFormObject.qualityAudience"
            active-text="Quality Audience (Verified by Cookie3)"
          />
          <el-tooltip
            effect="light"
            content="Target only quality users with your campaign by excluding bots or malicious and gamified actions. Note, this is an additional paid service."
            placement="top-start"
            :offset="-50"
          >
            <el-icon style="top: 0; margin-left: 0.4em" class="tooltip-icon">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>

    <debug-wrapper>{{ campaignFormObject }}</debug-wrapper>
  </el-form>
</template>

<script>
import CampaignValidationBuilder from "@/common/validation/CampaignValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import ContractSelectField from "@/components/ContractSelectField.vue";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import TokenInput from "@/components/TokenInput.vue";

export default {
  components: {
    TokenInput,
    ContractSelectField,
  },
  props: {
    modelValue: {
      type: CampaignFormObject,
      default: () => new CampaignFormObject(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["submit", "update:modelValue"],
  /**
   * @returns {{campaignFormObject: CampaignFormObject, validate: Object}}
   */
  data() {
    return {
      campaignFormObject: this.modelValue,
      frequencyRatioPriorities: [
        "frequencyRatioMonthly",
        "frequencyRatioWeekly",
        "frequencyRatioDaily",
      ],
    };
  },
  computed: {
    ValidationHelper: () => ValidationHelper,
    frequencyRatioDaily: {
      get() {
        return this.campaignFormObject.frequencyRatioDaily;
      },
      set(val) {
        this.setFrequencyRatio("frequencyRatioDaily", val);
      },
    },
    frequencyRatioWeekly: {
      get() {
        return this.campaignFormObject.frequencyRatioWeekly;
      },
      set(val) {
        this.setFrequencyRatio("frequencyRatioWeekly", val);
      },
    },
    frequencyRatioMonthly: {
      get() {
        return this.campaignFormObject.frequencyRatioMonthly;
      },
      set(val) {
        this.setFrequencyRatio("frequencyRatioMonthly", val);
      },
    },
    contract() {
      return this.$store.getters["Contract/getContract"](
        this.campaignFormObject.rewardPoolContract
      );
    },
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = CampaignValidationBuilder.createValidation(
        this.campaignFormObject
      );

      validation.$lazy = true;

      return validation;
    },
  },
  watch: {
    "campaignFormObject.rewardPoolContract"() {
      this.campaignFormObject.minimumPerUserAward = "";
      this.campaignFormObject.maximumPerUserAward = "";
    },
    modelValue() {
      this.campaignFormObject = this.modelValue;
    },
    campaignFormObject: {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.campaignFormObject);
      },
    },
  },
  methods: {
    setFrequencyRatio(lastChangedRatio, val) {
      if (isNaN(val)) {
        return;
      }

      if (val > 100 || val < 0) {
        return;
      }

      this.campaignFormObject[lastChangedRatio] = val;

      this.frequencyRatioPriorities = this.frequencyRatioPriorities.sort(
        (ratioName) => (ratioName === lastChangedRatio ? 1 : -1)
      );

      let sum = 0;

      for (const ratioName of this.frequencyRatioPriorities) {
        sum += parseInt(this.campaignFormObject[ratioName] || 0);
      }

      let difference = 100 - sum;

      if (difference === 0) {
        this.frequencyRatioCalculation = false;
      }

      for (const ratioName of this.frequencyRatioPriorities) {
        const ratioValue = parseInt(this.campaignFormObject[ratioName] || 0);

        sum -= ratioValue;

        if (ratioValue + difference > 100) {
          this.campaignFormObject[ratioName] = 100;
        } else if (ratioValue + difference < 0) {
          this.campaignFormObject[ratioName] = 0;
        } else {
          this.campaignFormObject[ratioName] = ratioValue + difference;
        }

        sum += parseInt(this.campaignFormObject[ratioName] || 0);
        difference = 100 - sum;

        if (sum === 100) {
          break;
        }
      }
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 0.5em;
}
</style>
