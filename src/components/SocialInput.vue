<template>
  <el-input
    v-model="value.link"
    placeholder="Please input"
    class="input-with-select"
  >
    <template #prepend>
      <el-dropdown>
        <span class="el-dropdown-link">
          <svg-twitter v-if="value.type === 'twitter'" />
          <svg-telegram v-else-if="value.type === 'telegram'" />
          <svg-discord v-else-if="value.type === 'discord'" />
          <svg-youtube v-else-if="value.type === 'youtube'" />
          <svg-reddit v-else-if="value.type === 'reddit'" />
          <svg-globe v-else-if="value.type === 'newsletter'" />
          <svg-blog v-else-if="value.type === 'blog'" />
          <svg-email v-else-if="value.type === 'email'" />
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="social-input">
            <el-dropdown-item @click="value.type = 'twitter'">
              <svg-twitter /> Twitter
            </el-dropdown-item>
            <el-dropdown-item @click="value.type = 'telegram'">
              <svg-telegram /> Telegram
            </el-dropdown-item>
            <el-dropdown-item @click="value.type = 'discord'">
              <svg-discord /> Discord
            </el-dropdown-item>
            <el-dropdown-item @click="value.type = 'youtube'">
              <svg-youtube /> Youtube
            </el-dropdown-item>
            <el-dropdown-item @click="value.type = 'reddit'">
              <svg-reddit /> Reddit
            </el-dropdown-item>
            <el-dropdown-item @click="value.type = 'newsletter'">
              <svg-globe /> Website
            </el-dropdown-item>
            <el-dropdown-item @click="value.type = 'blog'">
              <svg-blog /> Blog
            </el-dropdown-item>
            <el-dropdown-item @click="value.type = 'email'">
              <svg-email /> Email
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template v-if="id > 0" #append>
      <delete-button @click="$emit('inputDeleted', id)" />
    </template>
  </el-input>
</template>

<script>
import Social from "@/state/models/Social.js";
import DeleteButton from "@/components/DeleteButton.vue";
import SvgDiscord from "@/assets/icons/discord.svg";
import SvgReddit from "@/assets/icons/reddit.svg";
import SvgTelegram from "@/assets/icons/telegram.svg";
import SvgTwitter from "@/assets/icons/twitter.svg";
import SvgYoutube from "@/assets/icons/youtube.svg";
import SvgGlobe from "@/assets/icons/globe.svg";
import SvgBlog from "@/assets/icons/blog.svg";
import SvgEmail from "@/assets/icons/mail2.svg";

export default {
  components: {
    DeleteButton,
    SvgDiscord,
    SvgReddit,
    SvgTelegram,
    SvgTwitter,
    SvgYoutube,
    SvgGlobe,
    SvgBlog,
    SvgEmail,
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Social,
      default: () => new Social(),
    },
  },
  emits: ["modelValue:update", "inputDeleted"],
  data() {
    return {
      value: this.modelValue,
    };
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.$emit("modelValue:update", this.value);
      },
    },
    modelValue: {
      deep: true,
      handler() {
        this.value = this.modelValue;
      },
    },
  },
};
</script>

<style lang="scss">
.input-with-select {
  .el-input-group__prepend {
    padding-right: 1em;
    padding-left: 1em;
    margin-right: 0.5em;
    border-radius: var(--el-input-border-radius);
    border-right: 1px solid var(--el-border-color);
    svg {
      height: 1.5em;
      width: 1.75em;
      color: black;
      margin-top: 0.25em;
    }
  }
}
.social-input {
  .el-dropdown-menu__item {
    padding-top: 0.75em;
    padding-bottom: 0.75em;
  }
  svg {
    height: 1.5em;
    width: 1.75em;
    margin-right: 0.5em;
    color: black;
  }
}
</style>
