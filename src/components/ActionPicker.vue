<template>
  <el-collapse v-model="collapseValue" class="br-base b-solid">
    <el-collapse-item
      v-for="(action, idx) in actions"
      :key="action.id"
      :class="{ 'bt-solid': idx !== 0 }"
      :name="action.id"
    >
      <template #title>
        <div class="p-3">
          <b>{{ action.name || "Unnamed" }}</b>
          <br />
          0x{{ action.hash }}
        </div>
      </template>

      <div v-if="act(action.id)" class="p-3 bt-solid">
        <div class="d-flex w-100">
          <div class="ml-2 my-auto pb-3">
            <el-checkbox
              :model-value="act(action.id).minimumTransactionCount !== null"
              class="ml-1"
              @update:model-value="
                (val) => {
                  act(action.id).minimumTransactionCount = val ? '' : null;
                }
              "
            >
              &nbsp;
            </el-checkbox>
          </div>

          <el-form-item class="w-100" label="Minimum transaction limit">
            <el-input
              v-model="act(action.id).minimumTransactionCount"
              :disabled="act(action.id).minimumTransactionCount === null"
            />
            <sup class="text-secondary">
              Set minimum amount of transactions to count towards the reward.
            </sup>
          </el-form-item>
        </div>

        <div class="d-flex w-100">
          <div class="ml-2 my-auto pb-3">
            <el-checkbox
              :model-value="act(action.id).minimumTransactionLimit !== null"
              class="ml-1"
              @update:model-value="
                (val) => {
                  act(action.id).minimumTransactionLimit = val ? '' : null;
                }
              "
            >
              &nbsp;
            </el-checkbox>
          </div>

          <el-form-item class="w-100" label="Minimum transaction amount">
            <token-input
              v-model="act(action.id).minimumTransactionLimit"
              :disabled="act(action.id).minimumTransactionLimit === null"
              :contract="$store.getters['Contract/getContract']('USD')"
            />
            <sup class="text-secondary">
              Set minimum amount of tokens to count towards the reward.
            </sup>
          </el-form-item>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
  <debug-wrapper>{{ value }}</debug-wrapper>
  <debug-wrapper>{{ modelValue }}</debug-wrapper>
  <debug-wrapper>{{ collapseValue }}</debug-wrapper>
</template>

<script setup>
import TokenInput from "@/components/TokenInput.vue";
import DebugWrapper from "@/components/DebugWrapper.vue";
</script>

<script>
import RewardedActivityActionFormObject from "@/common/Form/RewardedActivityActionFormObject.js";

export default {
  props: {
    activity: {
      type: [String, null],
      default: null,
    },
    filterString: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  /**
   * @return {{
   *  allowValue: boolean,
   *  allowCount: boolean,
   *  value: RewardedActivityActionFormObject[]
   * }}
   */
  data() {
    return {
      value: new Map(),
      valuesUpdating: false,
    };
  },
  computed: {
    collapseValue: {
      /**
       * @return {String[]}
       */
      get() {
        return [...this.value.keys()];
      },
      /**
       * @param {String[]} collapseValue
       */
      set(collapseValue) {
        for (const actionId of this.value.keys()) {
          if (!collapseValue.includes(actionId)) {
            this.value.delete(actionId);
          }
        }

        for (const actionId of collapseValue) {
          if (this.value.has(actionId)) {
            continue;
          }

          const rewardedAction = new RewardedActivityActionFormObject();

          rewardedAction.id = actionId;

          this.value.set(actionId, rewardedAction);
        }
      },
    },
    actions() {
      return this.$store.getters["Activity/queryActions"]({
        activity: this.activity,
        queryString: this.filterString,
      });
    },
  },
  watch: {
    modelValue: "setValue",
    value: {
      deep: true,
      handler() {
        if (this.valuesUpdating) {
          return;
        }

        const values = [...this.value.values()];

        this.$emit("update:modelValue", values);
      },
    },
  },
  created() {
    this.setValue(this.modelValue);
  },
  methods: {
    setValue(rewardedActions) {
      const value = new Map();

      rewardedActions.forEach((rewardedAction) => {
        value.set(rewardedAction.id, rewardedAction);
      });

      this.valuesUpdating = true;

      this.value = value;

      this.$nextTick(() => {
        this.valuesUpdating = false;
      });
    },
    act(actionId) {
      return this.value.get(actionId);
    },
  },
};
</script>
