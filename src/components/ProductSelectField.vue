<template>
  <el-select-v2
    v-bind="$attrs"
    remote
    filterable
    :remote-method="queryProducts"
    clearable
    :options="options"
    :loading="loading"
    placeholder="Please enter a keyword"
  />
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      options: [],
    };
  },
  created() {
    this.queryProducts("");
  },
  methods: {
    async queryProducts(query) {
      if (this.loading) {
        return;
      }

      this.loading = true;

      const response = await this.$store.dispatch("Product/queryProducts", {
        query,
      });

      if (!response.success) {
        this.Toast("Failed to load products", "", "error");

        return;
      }

      this.options = response.data.map((product) => ({
        value: product.id,
        label: product.name,
      }));

      this.loading = false;
    },
  },
};
</script>
