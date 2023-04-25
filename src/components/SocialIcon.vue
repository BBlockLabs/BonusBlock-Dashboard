<template>
  <component :is="icon" class="icon" />
</template>

<script>
import SvgDiscord from "@/assets/icons/discord.svg";
import SvgReddit from "@/assets/icons/reddit.svg";
import SvgTelegram from "@/assets/icons/telegram.svg";
import SvgTwitter from "@/assets/icons/twitter.svg";
import SvgYoutube from "@/assets/icons/youtube.svg";

export default {
  props: {
    type: {
      type: String,
      required: true,
      default: null,
    },
  },
  computed: {
    icon() {
      switch (this.type) {
        case "twitter":
          return SvgTwitter;
        case "telegram":
          return SvgTelegram;
        case "discord":
          return SvgDiscord;
        case "youtube":
          return SvgYoutube;
        case "reddit":
          return SvgReddit;
      }

      return SvgTwitter;
    },
  },
};
</script>
