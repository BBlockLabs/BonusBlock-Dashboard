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

  <el-row :gutter="24">
    <el-col
      v-for="campaign in campaigns"
      :key="campaign.id"
      class="py-3"
      :md="12"
      :lg="3"
      :xl="4"
    >
      <campaign-card :campaign-id="campaign.id" />
    </el-col>
  </el-row>
</template>

<script>
import CampaignCard from "@/components/CampaignCard.vue";

export default {
  components: {
    CampaignCard,
  },
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
