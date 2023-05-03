<template>
  <el-input v-model="displayValue" placeholder="Amount" />
  <sub v-if="contract">
    {{ modelValue }}
  </sub>
</template>
<script>
import Contract from "@/state/models/Contract.js";
import { Formatter } from "@/common/Formatter.js";

export default {
  components: {},
  props: {
    modelValue: {
      type: [String, BigInt],
      default: null,
    },
    contract: {
      type: Contract,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    displayValue: {
      get: function () {
        if (this.contract == null) {
          return "";
        }
        return this.Formatter.token(
          this.modelValue,
          this.contract,
          this.contract.decimalSpaces
        );
      },
      set: function (modifiedValue) {
        if (this.contract == null) {
          return;
        }
        let newValue = parseFloat(modifiedValue.replace(/[^\d.]/g, ""));
        if (isNaN(newValue)) {
          newValue = 0;
        }

        let decimalSpaces = Math.pow(
          10,
          this.contract.decimalSpaces
        ).toString();
        let value = BigInt(newValue.toString() * decimalSpaces);
        this.$emit("update:modelValue", value);
      },
    },
    Formatter: () => Formatter,
  },
};
</script>
