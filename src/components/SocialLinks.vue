<template>
  <el-space class="social-links">
    <el-link
      v-if="props.github"
      :href="props.github"
      type="primary"
      target="_blank"
      :underline="false"
    >
      <svg-github />
    </el-link>

    <el-link
      v-if="props.twitter"
      :href="props.twitter"
      type="primary"
      target="_blank"
      :underline="false"
    >
      <svg-twitter />
    </el-link>

    <el-link
      v-if="props.telegram"
      :href="props.telegram"
      type="primary"
      target="_blank"
      :underline="false"
    >
      <svg-telegram />
    </el-link>

    <el-link
      v-if="props.reddit"
      :href="props.reddit"
      type="primary"
      target="_blank"
      :underline="false"
    >
      <svg-reddit />
    </el-link>

    <el-link
      v-if="props.discord"
      :href="props.discord"
      type="primary"
      target="_blank"
      :underline="false"
      class="icon-discord"
    >
      <svg-discord />
    </el-link>

    <el-link
      v-if="props.youtube"
      :href="props.youtube"
      type="primary"
      target="_blank"
      :underline="false"
      class="icon-youtube"
    >
      <svg-youtube />
    </el-link>
  </el-space>
</template>

<script setup lang="ts">
import SvgGithub from "@/assets/icons/github.svg?component";
import SvgTwitter from "@/assets/icons/twitter.svg?component";
import SvgTelegram from "@/assets/icons/telegram.svg?component";
import SvgReddit from "@/assets/icons/reddit.svg?component";
import SvgDiscord from "@/assets/icons/discord.svg?component";
import SvgYoutube from "@/assets/icons/youtube.svg?component";
import { defineProps } from "vue";

export interface Props {
  github?: string;
  twitter?: string;
  telegram?: string;
  reddit?: string;
  discord?: string;
  youtube?: string;
}

const props = defineProps<Props>();
</script>

<style lang="scss">
@use "element-plus/theme-chalk/src/mixins/function" as EPFunctions;
@use "@/design/vars.scss" as v;

.social-links {
  svg {
    height: 1.5em;
    width: auto;
    color: v.$social-svg-color;
    margin: 0;
  }
  .icon-discord {
    position: relative;
    top: 0.15em;
  }
  .icon-youtube {
    position: relative;
    top: 0.15em;
  }
}
</style>
