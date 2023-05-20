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

export default {
  mixins: [Toast],
  data() {
    return {
      filterString: "",
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
      }));
    },
  },
};
</script>
