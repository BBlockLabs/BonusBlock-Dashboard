<template>
  <el-container v-cloak>
    <el-aside
      v-if="$store.getters['Auth/isLoggedIn'] && !$store.state.hideMenus"
      class="br-solid d-flex flex-column"
      width="auto"
    >
      <navigation />
    </el-aside>

    <el-container vertical>
      <el-header
        v-if="$store.getters['Auth/isLoggedIn'] && !$store.state.hideMenus"
        class="bb-solid"
      >
        <page-head />
      </el-header>

      <el-main class="d-flex main-container">
        <div class="w-100">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import PageHead from "@/components/PageHead.vue";
import Navigation from "@/components/NavigationMenu.vue";

export default {
  components: {
    PageHead,
    Navigation,
  },
  async mounted() {
    this.removeLoader();
  },
  methods: {
    removeLoader() {
      this.$nextTick(() => {
        document.getElementById("loader").style.display = "none";
      });
    },
  },
};
</script>
