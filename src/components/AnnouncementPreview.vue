<template>
  <el-card :body-style="{ padding: '0px' }">
    <img :src="fileUrl" alt="Banner" />

    <div style="padding: 14px">
      <h1>{{ announcement.title }}</h1>
      <div>
        {{ announcement.description }}
      </div>
    </div>
  </el-card>
</template>

<script>
import Announcement from "@/state/models/Announcement.js";
import FileParser from "@/common/FileParser.js";

export default {
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
    announcement: "setFileUrl",
  },
  created: "setFileUrl",
  methods: {
    async setFileUrl() {
      if (!this.announcement) {
        this.fileUrl = null;
      }

      this.fileUrl = FileParser.fileToBase64(this.announcement.banner);
    },
  },
};
</script>

<style lang="scss" scoped>
img {
  aspect-ratio: 16 / 9;
  width: 100%;
}
</style>
