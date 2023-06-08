<template>
  <el-row class="h-100 flex-nowrap align-items-center">
    <el-button
      v-if="$mq.sm"
      link
      class="p-2"
      style="margin-left: -0.65em"
      @click="$store.state.menuOpened = !$store.state.menuOpened"
    >
      <svg-sidebar-collapse v-if="$store.state.menuOpened" class="icon-extra-large" />
      <svg-sidebar-expand v-if="!$store.state.menuOpened" class="icon-extra-large" />
    </el-button>

    <span v-if="!$store.state.hideMenus" class="my-auto mr-1">
      {{ currentRoute ? currentRoute.parent || currentRoute.name : $route.name }}
    </span>
    <b-block-logo v-else />

    <el-menu
      v-if="routeOptions.length > 0"
      class="m-1"
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

    <div class="flex-grow"></div>

    <el-button
      v-if="$store.getters['Auth/isLoggedIn'] && canDebug"
      link
      class="mr-1"
      :type="$store.state.debug ? 'danger' : ''"
      @click="$store.commit('toggleDebug')"
    >
      <svg-debug class="icon-large my-auto" />
    </el-button>

    <el-dropdown v-if="$store.getters['Auth/isLoggedIn']">
      <span class="d-flex align-items-center project-dropdown">
        <avatar :file="projectImage" />
        <span class="ml-2 pl-1 my-auto max-two-lines">
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
  </el-row>
</template>

<script>
import NavigationList from "@/common/Navigation";
import MenuItem from "@/components/MenuItem.vue";
import Avatar from "@/components/AvatarImage.vue";
import Toast from "@/mixins/Toast.js";
import BBlockLogo from "@/assets/bblock/logo.svg";
import SvgDebug from "@/assets/icons/debug.svg";
import SvgSidebarCollapse from "@/assets/icons/sidebar/sidebar-collapse.svg";
import SvgSidebarExpand from "@/assets/icons/sidebar/sidebar-expand.svg";

export default {
  components: {
    MenuItem,
    Avatar,
    BBlockLogo,
    SvgDebug,
    SvgSidebarCollapse,
    SvgSidebarExpand,
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
