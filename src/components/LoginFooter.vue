<template>
  <el-row justify="space-between">
    <el-col :span="9" class="align-left">
      <social-links
        :twitter="LinkTwitter"
        :github="LinkGithub"
        :telegram="LinkTelegram"
        :reddit="LinkReddit"
      />
    </el-col>
    <el-col :span="15" class="align-right">
      <el-link
        type="primary"
        href="https://t.me/MrX01010101010"
        target="_blank"
      >
        Contact us
        <svg-telegram class="icon ml-1" />
      </el-link>
      <el-divider direction="vertical" />
      <el-link
        type="primary"
        href="https://calendly.com/bonusblock/30min"
        target="_blank"
      >
        Book a meeting
        <calendar class="icon ml-1" />
      </el-link>
    </el-col>
  </el-row>
</template>

<script>
import SocialLinks from "@/components/SocialLinks.vue";
import SvgTelegram from "@/assets/icons/telegram.svg";

export default {
  components: {
    SocialLinks,
    SvgTelegram,
  },
  data() {
    return {
      LinkGithub: import.meta.env.VITE_LINK_GITHUB,
      LinkTwitter: import.meta.env.VITE_LINK_TWITTER,
      LinkTelegram: import.meta.env.VITE_LINK_TELEGRAM,
      LinkReddit: import.meta.env.VITE_LINK_REDDIT,
    };
  },
};
</script>
