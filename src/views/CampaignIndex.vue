<template>
  <el-row>
    <el-col>
      Campaign Index
      <router-link to="/campaign/add">Add new</router-link>

      <el-row v-for="campaign in campaigns" :key="campaign.id">
        <el-col>
          <router-link :to="`/campaign/${campaign.id}/edit`">
            open
          </router-link>
          <pre>
            {{ campaign }}
          </pre>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  computed: {
    campaigns() {
      return this.$store.getters["Campaign/getAllCampaigns"];
    },
  },
  created() {
    this.$store.dispatch("Campaign/loadCampaigns");
  },
};
</script>
