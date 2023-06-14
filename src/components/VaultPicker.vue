<template>
  <el-select
    v-model="selectedValue"
    clearable
    filterable
    remote
    remote-show-suffix
    placeholder="Any vault"
    :remote-method="fetchContracts"
    :loading="loading"
    class="w-100"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :value="item.id"
      :label="(item.name ?? 'Unnamed') + ' (' + item.hash + ')'"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <b v-html="item.name ? highlightSearchString(item.name) : 'Unnamed'" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      (0x<span v-html="highlightSearchString(item.hash)" />)
    </el-option>
  </el-select>
</template>

<script>
import Toast from "@/mixins/Toast.js";
import highlightSearchTerms from "@/mixins/highlightSearchTerms.js";
import ContractType from "@/common/ContractType.js";

export default {
  mixins: [Toast],
  props: {
    product: {
      type: String,
      require: true,
      default: "",
    },
    type: {
      type: ContractType,
      require: true,
      default: "",
    },
    network: {
      type: String,
      require: true,
      default: "",
    },
    modelValue: {
      type: [String, null],
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      loading: false,
      selectedValue: this.modelValue,
      page: 1,
      perPage: 25,
      lastPage: false,
      filterString: "",
    };
  },
  computed: {
    options() {
      return this.$store.getters["Activity/queryActivities"]({
        productId: this.product,
        type: this.type,
        selectedRewardedActivities: this.$store.getters[
          "RewardedActivity/getByCampaign"
        ](this.$route.params.id),
        queryString: this.filterString,
      });
    },
  },
  watch: {
    selectedValue() {
      this.$emit("update:modelValue", this.selectedValue);
    },
    product() {
      this.fetchContracts(this.filterString);
    },
    type() {
      this.fetchContracts(this.filterString);
    },
    filterString() {
      this.fetchContracts(this.filterString);
    },
  },
  mounted() {
    this.fetchContracts(this.filterString);
  },
  methods: {
    highlightSearchString(str) {
      return highlightSearchTerms(str, this.filterString ? [this.filterString.toLowerCase()] : null);
    },
    async fetchContracts(filterString) {
      this.loading = true;
      this.filterString = filterString;

      const activitiesResponse = await this.$store.dispatch(
        "Activity/queryActivities",
        {
          product: this.product,
          network: this.network,
          type: this.type,
          filter: filterString,
          page: this.page,
          perPage: this.perPage,
        }
      );

      if (!activitiesResponse.success) {
        this.Toast("Failed To load activities", "", "error");
        this.loading = false;
        return;
      }

      this.lastPage = activitiesResponse.data.length < this.perPage * this.page;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-selected {
  background-color: var(--el-color-primary-light-9);
}

.activity-picker {
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
