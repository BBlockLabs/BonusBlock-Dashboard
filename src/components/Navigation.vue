<template>
  <logo
    class="mx-auto px-4"
    :small="menuCollapsed || $mq.xl"
  />

  <div
    class="mx-auto"
    :class="{'w-100': !menuCollapsed && !$mq.xl}"
  >
    <el-menu
      class="br-none"
      :collapse="menuCollapsed || $mq.xl"
      mode="vertical"
      :ellipsis="false"
      :default-active="$route.name"
      popper-effect="light"
      @select="name => $router.replace({name})"
    >
      <menu-item
        v-for="route in routes"
        :key="route.name"
        :name="route.name"
      />
    </el-menu>
  </div>

  <div
    v-if="!$mq.xl"
    class="mt-auto p-3"
    :class="{'mx-auto': menuCollapsed}"
  >
    <el-button
      link
      @click="menuCollapsed = !menuCollapsed"
    >
      <sidebar-collapse
        v-if="!menuCollapsed"
        class="icon-extra-large"
      />
      <sidebar-expand
        v-if="menuCollapsed"
        class="icon-extra-large"
      />
    </el-button>
  </div>
</template>

<script>
import NavigationList from '@/common/Navigation';
import MenuItem from '@/components/MenuItem';
import Logo from '@/components/Logo';
import {SidebarCollapse, SidebarExpand} from 'iconoir-vue';

export default {
  components: {
    MenuItem,
    Logo,
    SidebarCollapse,
    SidebarExpand,
  },
  data() {
    return {
      menuCollapsed: false,
    };
  },
  computed: {
    routes() {
      return NavigationList.filter(route => route.parent === null);
    },
  },
};
</script>
