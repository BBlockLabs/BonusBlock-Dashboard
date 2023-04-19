<template>
  <el-card :body-style="{ padding: '0px' }">
    <img :src="FileParser.fileObjectSrc(announcement.banner)" />
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
  computed: {
    FileParser: () => FileParser,
    announcement() {
      const announcement = this.$store.getters["Announcement/getAnnouncement"](
        this.announcementId
      );

      return announcement || new Announcement();
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
