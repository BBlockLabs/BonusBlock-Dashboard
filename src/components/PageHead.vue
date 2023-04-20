<template>
  <el-row justify="space-between" class="h-100">
    <el-col class="d-flex h-100" :span="-1">
      <span class="my-auto">
        {{
          currentRoute ? currentRoute.parent || currentRoute.name : $route.name
        }}
      </span>
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
        <icon-bell class="icon-large my-auto" />

        <el-button
          link
          :type="$store.state.debug ? 'danger' : ''"
          @click="$store.commit('toggleDebug')"
        >
          <git-compare class="icon-large my-auto" />
        </el-button>

        <avatar class="ml-3 my-auto" :file="projectImage" />

        <span class="ml-3 my-auto">
          {{ $store.state.Project.currentProject.title }}
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import NavigationList from "@/common/Navigation";
import MenuItem from "@/components/MenuItem.vue";
import Avatar from "@/components/AvatarImage.vue";
import { Bell as IconBell, GitCompare } from "iconoir-vue";

export default {
  components: {
    MenuItem,
    IconBell,
    GitCompare,
    Avatar,
  },
  data() {},
  computed: {
    projectImage() {
      return {
        data: this.$store.state.Project.currentProject.image,
        type: this.$store.state.Project.currentProject.imageType,
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
};
</script>
