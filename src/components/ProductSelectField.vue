<template>
  <el-select-v2
    v-bind="$attrs"
    remote
    filterable
    :remote-method="(query) => (searchString = query)"
    clearable
    :options="options"
    :loading="loading"
    placeholder="Please enter a keyword"
  />
</template>

<script>
import Toast from "@/mixins/Toast.js";
import ProductFilters from "@/common/Http/ProductFilters.js";

export default {
  mixins: [Toast],
  props: {
    filters: {
      type: ProductFilters,
      default: () => new ProductFilters(),
    },
  },
  data() {
    return {
      loading: false,
      filteredOptions: [],
      searchString: "",
    };
  },
  computed: {
    options() {
      return this.filteredOptions.filter((option) =>
        option.label.toLowerCase().includes(this.searchString.toLowerCase())
      );
    },
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.loadFilteredProducts();
      },
    },
  },
  created() {
    this.loadFilteredProducts();
  },
  methods: {
    async loadFilteredProducts() {
      if (this.filters.networksIds.length === 0) {
        return;
      }

      this.loading = true;

      const response = await this.$store.dispatch(
        "Product/queryProducts",
        this.filters
      );

      if (!response.success) {
        this.Toast("Failed to load products", "", "error");

        return;
      }

      this.filteredOptions = response.data.map((product) => ({
        value: product.id,
        label: product.name,
      }));

      this.loading = false;
    },
  },
};
</script>
