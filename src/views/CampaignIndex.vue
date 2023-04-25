<template>
  <el-row justify="space-between">
    <el-col :span="-1">
      <h1 class="m-0"><b>Your Campaigns</b></h1>
      Here are all of your campaigns.
    </el-col>

    <el-col :span="-1">
      <router-link to="/campaign/add">
        <el-button round type="primary"> + Create new Campaign </el-button>
      </router-link>
    </el-col>
  </el-row>

  <el-row v-for="campaign in campaigns" :key="campaign.id">
    <el-col>
      <router-link :to="`/campaign/${campaign.id}/edit`"> open </router-link>
      <pre>
        {{ campaign }}
      </pre>
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
