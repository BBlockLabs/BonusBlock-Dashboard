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
    this.$nextTick(() => {
      document.getElementById("loader").style.display = "none";
    });

    if (this.$store.getters["Auth/isLoggedIn"]) {
      return;
    }

    await this.$store.dispatch("Auth/checkLocalStorageForSession");

    if (this.$store.getters["Auth/isLoggedIn"]) {
      if (this.$store.getters["Project/getProject"]) {
        this.$router.push("/dashboard");
      } else {
        this.$store.state.Auth.newUser = true;
        this.$router.push("/create-project");
      }
    } else {
      this.$router.push("/login");
    }
  },
};
</script>
