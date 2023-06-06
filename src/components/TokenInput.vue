<template>
  <el-input
    v-model="inputValue"
    placeholder="Provide token amount"
    v-bind="$attrs"
    :readonly="!rate"
  >
    <template #prefix>
      <span class="text-secondary">
        {{ denom }}
      </span>
      &nbsp;
    </template>

    <template #append>
      <span class="text-secondary" v-if="rate">
        $ {{ Math.round(inputValue * rate.rate * 100) / 100 }}
      </span>
      <span class="text-secondary" v-else-if="rate === false">
        Can't load rate
      </span>
      <span class="text-secondary" v-else>
        Loading rate
      </span>
    </template>
  </el-input>
</template>

<script>
import Contract from "@/state/models/Contract.js";
import { Formatter } from "@/common/Formatter.js";

export default {
  props: {
    modelValue: {
      type: [String, BigInt, Number],
      default: null,
    },
    contract: {
      type: Contract,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      inputValue: "",
    };
  },
  computed: {
    rate() {
      const denom = this.denom !== "$" ? this.denom.toUpperCase() : "USD";

      return this.$store.getters["ConversionRate/findPair"](denom, "USD");
    },
    decimalSpaces() {
      return this.contract?.decimalSpaces || 6;
    },
    denom() {
      return this.contract?.currencyName || "";
    },
    value() {
      if (
        this.modelValue === "" ||
        isNaN(this.modelValue) ||
        this.modelValue === null
      ) {
        return null;
      }

      return BigInt(this.modelValue);
    },
  },
  watch: {
    inputValue: "parseUserInput",
    value: "setInputValue",
    contract() {
      this.loadConversionRate();

      if (!this.inputValue) {
        this.parseUserInput(this.inputValue, "");

        return;
      }

      const [wholes, decimals] = this.inputValue.split(".");

      if (decimals === undefined) {
        this.parseUserInput(this.inputValue, "");

        return;
      }

      this.parseUserInput(
        this.inputValue,
        `${wholes}.${decimals.slice(0, this.decimalSpaces)}`
      );
    },
  },
  created() {
    this.setInputValue();
    this.loadConversionRate();
  },
  methods: {
    async loadConversionRate() {
      if (!this.contract || this.rate) {
        return;
      }

      await this.$store.dispatch(
        "ConversionRate/loadConversionRate",
        this.contract.currencyName
      );
    },
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
      }

      this.$emit(
        "update:modelValue",
        (
          wholes +
          (decimals || "")
            .padEnd(this.decimalSpaces, "0")
            .slice(0, this.decimalSpaces)
        ).replace(/^0+/, "")
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
