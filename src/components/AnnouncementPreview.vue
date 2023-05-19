<template>
  <el-card :body-style="{ padding: '0px' }" class="b-solid" shadow="never">
    <img :src="fileUrl" alt="Banner" class="preview-banner" />

    <div class="p-3">
      <div>
        <h1 class="my-3">{{ announcement.title }}</h1>
        <div>
          {{ announcement.description }}
        </div>
      </div>

      <el-row justify="space-between">
        <el-col :span="-1" class="d-flex">
          <el-row class="my-auto" :gutter="5">
            <el-col
              v-for="(social, idx) in announcement.socials.filter(
                ({ link }) => link
              )"
              :key="idx"
              :span="-1"
            >
              <el-link
                v-if="social.type === 'telegram'"
                :href="'https://t.me/' + social.link.substring(1)"
                :underline="false"
                target="_blank"
              >
                <social-icon :type="social.type" />
              </el-link>
              <el-link
                v-else
                :href="social.link"
                target="_blank"
                :underline="false"
              >
                <social-icon :type="social.type" />
              </el-link>
            </el-col>
          </el-row>
        </el-col>

        <el-col
          v-if="announcement.buttonUrl && announcement.buttonLabel"
          :span="-1"
        >
          <a :href="announcement.buttonUrl" target="_blank">
            <el-button>
              {{ announcement.buttonLabel }}
            </el-button>
          </a>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import Announcement from "@/state/models/Announcement.js";
import FileParser from "@/common/FileParser.js";
import SocialIcon from "@/components/SocialIcon.vue";

export default {
  components: {
    SocialIcon,
  },
  props: {
    announcementId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fileUrl: null,
    };
  },
  computed: {
    announcement() {
      const announcement = this.$store.getters["Announcement/getAnnouncement"](
        this.announcementId
      );

      return announcement || new Announcement();
    },
  },
  watch: {
    announcement: {
      deep: true,
      handler() {
        this.setFileUrl();
      },
    },
  },
  created() {
    this.setFileUrl();
  },
  methods: {
    async setFileUrl() {
      if (!this.announcement) {
        this.fileUrl = null;
      }

      this.fileUrl = await FileParser.fileToBase64(this.announcement.banner);
    },
  },
};
</script>

<style lang="scss" scoped>
img.preview-banner {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}
</style>
