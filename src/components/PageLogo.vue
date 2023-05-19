<template>
  <div class="d-flex logo">
    <LogoSmall v-if="small" class="logo-icon" />
    <logo v-else class="logo-icon" />
  </div>
</template>

<script>
import Logo from "@/assets/bblock/banner.svg";
import LogoSmall from "@/assets/bblock/cubes.svg";

export default {
  components: {
    Logo,
    LogoSmall,
  },
  props: {
    small: Boolean,
  },
};
</script>

<style scoped lang="scss">
@use "sass:map";
@use "@/design/element-plus-theme.scss" as theme;
@use "element-plus/theme-chalk/src/mixins/function" as EPFunctions;

.logo {
  height: map.get(theme.$header, "height");
}

.logo-icon {
  color: EPFunctions.getCssVar("color", "primary");
  margin-top: auto;
  margin-bottom: auto;
  height: 3em;
}

.logo-text {
  margin-top: auto;
  margin-bottom: auto;
  font-weight: 700;
  font-size: 15px;
}
</style>
