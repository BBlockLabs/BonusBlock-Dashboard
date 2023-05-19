<template>
  <component :is="icon" class="icon" />
</template>

<script>
import SvgDiscord from "@/assets/icons/discord.svg";
import SvgReddit from "@/assets/icons/reddit.svg";
import SvgTelegram from "@/assets/icons/telegram.svg";
import SvgTwitter from "@/assets/icons/twitter.svg";
import SvgYoutube from "@/assets/icons/youtube.svg";
import SvgGlobe from "@/assets/icons/globe.svg";
import SvgMail from "@/assets/icons/email.svg";
import SvgBlog from "@/assets/icons/notes.svg";

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
        case "website":
          return SvgGlobe;
        case "newsletter":
          return SvgMail;
        case "blog":
          return SvgBlog;
      }

      return SvgTwitter;
    },
  },
};
</script>
