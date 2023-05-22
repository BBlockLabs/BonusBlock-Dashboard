<template>
  <el-select-v2
    v-bind="$attrs"
    remote
    filterable
    :remote-method="
      (query) => {
        filterString = query;
      }
    "
    clearable
    :options="options"
    placeholder="Please enter a keyword"
    @blur="filterString = ''"
  >
    <template #default="{ item }">
      <div class="d-flex">
        <img
          v-if="item.icon"
          :src="'data:image/svg+xml;base64,' + item.icon"
          class="el-select-v2-icon"
          alt=""
        />
        <span>{{ item.label }}</span>

        <span class="text-secondary ml-auto">
          {{ item.address }}
        </span>
      </div>
    </template>
  </el-select-v2>
</template>

<script>
import Toast from "@/mixins/Toast.js";
import SvgEth from "@/assets/icons/cryptoicons/eth.svg?raw";

export default {
  mixins: [Toast],
  data() {
    return {
      filterString: "",
      icons: {
        ETH: window.btoa(SvgEth),
      },
    };
  },
  computed: {
    options() {
      return this.$store.getters["Contract/queryContracts"](
        this.filterString
      ).map((contract) => ({
        label: contract.title,
        address: contract.address,
        value: contract.id,
        icon: this.icons[contract.currencyName] || null,
      }));
    },
  },
};
</script>

<style lang="scss">
.el-select-v2-icon {
  height: 2em;
  width: 2em;
  margin-right: 0.5em;
  margin-top: 0.25em;
}
</style>
