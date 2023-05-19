<template>
  <div style="height:100%; display:flex;flex-direction: column;">
    <div style="display: flex;flex-wrap: nowrap;justify-content: space-between;align-items: center;">
      <div><h1 style="margin: 0">Your Campaigns</h1></div>
      <router-link to="/campaign/add">
        <el-button round type="primary"> + Create new Campaign</el-button>
      </router-link>
    </div>
    <div v-if="campaigns.length === 0" class="no-campaigns">
      <div>
        <SvgEmptyBlock/>
      </div>
      <div>
        You dont have any campaigns yet
      </div>
    </div>
    <el-row v-else :gutter="24">
      <el-col
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="py-3"
        :md="12"
        :lg="8"
        :xl="6"
      >
        <campaign-card :campaign-id="campaign.id" />
      </el-col>
    </el-row>
  </div>
</template>

<style>
.no-campaigns {
  display: flex;
  flex-grow: 1;
  font-size: 1.3em;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

<script>
import CampaignCard from "@/components/CampaignCard.vue";
import SvgEmptyBlock from "@/assets/icons/empty-block-wireframe.svg";

export default {
  components: {
    CampaignCard,
    SvgEmptyBlock,
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
