<template>
  <el-menu-item v-if="childRoutes.length === 0" :key="name" :index="name">
    <el-icon v-if="currentRoute.icon" :style="!$mq.sm && $mq.md ? 'font-size: 2em' : ''">
      <component :is="currentRoute.icon" />
    </el-icon>

    <template #title>
      <strong>{{ name }}</strong>
    </template>
  </el-menu-item>

  <el-sub-menu v-if="childRoutes.length > 0" :key="name" :index="name">
    <template #title>
      <el-icon v-if="currentRoute.icon">
        <component :is="currentRoute.icon" />
      </el-icon>

      <strong>{{ name }}</strong>
    </template>

    <menu-item
      v-for="route in childRoutes"
      :key="route.name"
      :name="route.name"
    />
  </el-sub-menu>
</template>

<script>
import NavigationList from "@/common/Navigation";

export default {
  name: "MenuItem",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    currentRoute() {
      return NavigationList.find((route) => route.name === this.name) || null;
    },
    childRoutes() {
      return NavigationList.filter(
        (route) => route.parent === this.name && route.showInMenu
      );
    },
  },
};
</script>
