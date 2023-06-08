<template>
  <logo class="mx-auto" :class="$mq.sm ? '' : 'px-4'" :small="!$mq.sm && $mq.md" />

  <div class="mx-auto" :class="{ 'w-100': !$mq.md }">
    <el-menu
      class="br-none"
      :collapse="!$mq.sm && $mq.md"
      mode="vertical"
      :ellipsis="false"
      :default-active="$route.name"
      popper-effect="light"
      @select="(name) => $router.replace({ name })"
    >
      <menu-item v-for="route in routes" :key="route.name" :name="route.name" />
    </el-menu>
  </div>
</template>

<script>
import NavigationList from "@/common/Navigation";
import MenuItem from "@/components/MenuItem.vue";
import Logo from "@/components/PageLogo.vue";

export default {
  components: {
    MenuItem,
    Logo,
  },
  computed: {
    routes() {
      return NavigationList.filter((route) => route.parent === null);
    },
  },
};
</script>
