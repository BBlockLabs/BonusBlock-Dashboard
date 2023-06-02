<template>
  <el-row justify="space-between" class="h-100">
    <el-col class="d-flex h-100" :span="-1">
      <span class="my-auto" v-if="!$store.state.hideMenus">
        {{
          currentRoute ? currentRoute.parent || currentRoute.name : $route.name
        }}
      </span>
      <b-block-logo v-else />
    </el-col>

    <el-col v-if="routeOptions.length > 0" class="h-100" :span="-1">
      <el-menu
        :ellipsis="false"
        :default-active="$route.name"
        mode="horizontal"
        @select="(name) => $router.replace({ name })"
      >
        <menu-item
          v-for="route in routeOptions"
          :key="route.name"
          :name="route.name"
        />
      </el-menu>
    </el-col>

    <el-col class="d-flex h-100" :span="-1">
      <div v-if="$store.getters['Auth/isLoggedIn']" class="d-flex h-100">
        <el-button
          v-if="canDebug"
          link
          :type="$store.state.debug ? 'danger' : ''"
          @click="$store.commit('toggleDebug')"
        >
          <git-compare class="icon-large my-auto" />
        </el-button>

        <el-dropdown>
          <span class="d-flex align-items-center project-dropdown">
            <avatar :file="projectImage" />
            <span class="ml-3 my-auto">
              {{ $store.state.Project.currentProject?.title ?? "User/Wallet" }}
            </span>
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="loggedOut">
                <el-icon><user /></el-icon>
                Log out
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import NavigationList from "@/common/Navigation";
import MenuItem from "@/components/MenuItem.vue";
import Avatar from "@/components/AvatarImage.vue";
import { GitCompare } from "iconoir-vue";
import Toast from "@/mixins/Toast.js";
import BBlockLogo from "@/assets/bblock/logo.svg";

export default {
  components: {
    MenuItem,
    GitCompare,
    Avatar,
    BBlockLogo,
  },
  computed: {
    env() {
      return import.meta.env.VITE_ENV || "nope";
    },
    canDebug() {
      return import.meta.env.VITE_ENV === "local";
    },
    projectImage() {
      return {
        data: this.$store.state.Project.currentProject?.image,
        type: this.$store.state.Project.currentProject?.imageType,
      };
    },
    currentRoute() {
      return (
        NavigationList.find((route) => route.name === this.$route.name) || null
      );
    },
    routeOptions() {
      if (this.currentRoute === null) {
        return [];
      }

      const navRoutes = NavigationList.filter(
        (route) => route.parent !== null && route.showInMenu
      );

      const siblingRoutes = navRoutes.filter(
        (route) => route.parent === this.currentRoute.parent
      );

      if (siblingRoutes.length > 0) {
        return siblingRoutes;
      }

      // Return child routes of the current route
      return navRoutes.filter(
        (route) => route.parent === this.currentRoute.name
      );
    },
  },
  methods: {
    async loggedOut() {
      await this.$store.dispatch("Auth/logout");
      Toast.methods.Toast("Logged out", "", "success");
      this.$router.push("/login");
    },
  },
};
</script>
