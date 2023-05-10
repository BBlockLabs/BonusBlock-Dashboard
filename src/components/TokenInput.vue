<template>
  <el-input v-model="inputValue" placeholder="Amount" />
</template>

<script>
import Contract from "@/state/models/Contract.js";
import { Formatter } from "@/common/Formatter.js";

export default {
  props: {
    modelValue: {
      type: [String, BigInt],
      default: null,
    },
    contract: {
      type: Contract,
      default() {
        const contract = new Contract();

        contract.decimalSpaces = 6;
        contract.denom = "";

        return contract;
      },
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      inputValue: "",
    };
  },
  computed: {
    decimalSpaces() {
      return this.contract?.decimalSpaces || 6;
    },
    value() {
      if (this.modelValue === "" || isNaN(this.modelValue)) {
        return null;
      }

      return BigInt(this.modelValue);
    },
  },
  watch: {
    inputValue: "parseUserInput",
    value: "setInputValue",
    contract() {
      this.parseUserInput(this.inputValue, "");
    },
  },
  methods: {
    parseUserInput(newValue, oldValue) {
      if (isNaN(newValue)) {
        this.inputValue = isNaN(oldValue) ? "" : oldValue;

        return;
      }

      if (newValue === "") {
        this.$emit("update:modelValue", "");

        return;
      }

      const [wholes, decimals] = newValue.split(".");

      if (decimals !== undefined && decimals.length > this.decimalSpaces) {
        this.inputValue = oldValue;

        return;
      }

      this.$emit(
        "update:modelValue",
        wholes + (decimals || "").padEnd(this.decimalSpaces, "0")
      );
    },
    setInputValue() {
      if (this.value === null) {
        this.inputValue = "";

        return;
      }

      if (this.value === 0) {
        this.inputValue = "0";

        return;
      }

      const numberString = Formatter.bigIntToPrecision(
        this.value,
        this.decimalSpaces,
        this.decimalSpaces
      );

      if (this.inputValue && numberString.includes(this.inputValue)) {
        return;
      }

      let [wholes, decimals] = numberString.split(".");

      decimals = decimals.replace(/0+$/, "");

      if (decimals.length === 0) {
        this.inputValue = wholes;
      } else {
        this.inputValue = `${wholes}.${decimals}`;
      }
    },
  },
};
</script>
