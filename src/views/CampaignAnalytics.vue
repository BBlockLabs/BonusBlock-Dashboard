<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <el-container v-loading="loading" class="h-100" style="padding-left: 20px">
      <el-main class="pos-relative">
        <div class="pos-absolute w-100">
          <div style="margin-right: 20px; margin-top: 20px">
            <el-row class="is-justify-space-between">
              <el-col :span="-1">
                <h1 class="m-0">
                  {{ campaign ? campaign.name : "" }} campaign Analytics
                </h1>
              </el-col>
              <el-col :span="-1">
                <!--                <el-button type="primary"> Export Data</el-button>-->
                <router-link
                  v-if="campaign"
                  :to="`/campaign/${campaign.id}/edit`"
                >
                  <el-button type="primary"> Manage Campaign</el-button>
                </router-link>
              </el-col>
            </el-row>
            <el-row class="mt-1" align="middle">
              <el-col :span="-1">
                <b>Product: {{ campaign ? campaign.name : "" }} Categories: </b>
              </el-col>
              <el-col v-if="campaign" :span="-1">
                <el-tag
                  v-for="category in categories"
                  :key="category.id"
                  class="mx-1"
                  round
                >
                  {{ category.name }}
                </el-tag>
              </el-col>
            </el-row>

            <el-row align="middle">
              <el-col class="mt-1" :span="-1">
                <el-tabs v-model="interactionsRange">
                  <el-tab-pane label="All Time" name="all"></el-tab-pane>
                  <el-tab-pane label="Monthly" name="month"></el-tab-pane>
                  <el-tab-pane label="Weekly" name="week"></el-tab-pane>
                  <el-tab-pane label="Today" name="today"></el-tab-pane>
                </el-tabs>
              </el-col>
              <!--              <el-col :span="-1">
                              <el-button class="ml-4" type="default">Set custom period</el-button>
                            </el-col>-->
            </el-row>
            <el-row>
              <el-col
                v-if="interactionsSeries[0].data.length > 0"
                :md="12"
                style="min-height: 20em"
              >
                <apexchart
                  ref="interactionsChart"
                  v-loading="chartLoading"
                  style="width: 100%"
                  height="100%"
                  type="bar"
                  :options="interactionsOptions"
                  :series="interactionsSeries"
                ></apexchart>
              </el-col>
              <el-col
                v-if="campaign && analytics.campaignCost !== 0"
                :md="12"
                class="pl-3"
              >
                <el-card class="analytics-card yellow" shadow="never">
                  <el-row class="d-flex mt-3 mb-4">
                    <el-col
                      ><strong style="font-size: 1.2em"
                        >Total rewards pool</strong
                      ></el-col
                    >
                  </el-row>
                  <strong style="font-size: 3em">{{ totalRewardsPool }}</strong>
                  &nbsp;<strong style="font-size: 2em">{{
                    campaign.rewardPoolCurrencyName
                  }}</strong>
                </el-card>
                <div style="display: flex">
                  <div>
                    <el-card v-if="campaign" class="analytics-card mt-3">
                      <el-row
                        class="d-flex mt-3 mb-4"
                        style="
                          flex-wrap: nowrap;
                          justify-content: space-between;
                        "
                      >
                        <el-col :span="21"
                          ><strong style="font-size: 1.2em"
                            >Rewards claimed</strong
                          ></el-col
                        >
                        <el-col :span="3" style="text-align: right">
                          {{
                            Math.round(
                              (Number(analytics.rewardsDistributed) /
                                Number(campaign.rewardPoolTokenCount)) *
                                100 *
                                100
                            ) / 100
                          }}%
                        </el-col>
                      </el-row>
                      <strong style="font-size: 3em">{{
                        rewardsClaimed
                      }}</strong>
                      &nbsp;<strong style="font-size: 2em">{{
                        campaign.rewardPoolCurrencyName
                      }}</strong>
                    </el-card>
                    <el-card v-if="campaign" class="analytics-card mt-3">
                      <el-row
                        class="d-flex mt-3 mb-4"
                        style="
                          flex-wrap: nowrap;
                          justify-content: space-between;
                        "
                      >
                        <el-col :span="18"
                          ><strong style="font-size: 1.2em"
                            >Rewards left</strong
                          ></el-col
                        >
                        <el-col :span="4" style="text-align: right">
                          {{
                            100 -
                            Math.round(
                              (Number(analytics.rewardsDistributed) /
                                Number(campaign.rewardPoolTokenCount)) *
                                100 *
                                100
                            ) /
                              100
                          }}%
                        </el-col>
                      </el-row>
                      <strong style="font-size: 3em">
                        {{ rewardsLeft }}
                      </strong>
                      &nbsp;<strong style="font-size: 2em">{{
                        campaign.rewardPoolCurrencyName
                      }}</strong>
                    </el-card>
                  </div>
                  <div
                    class="mt-3 ml-3"
                    style="
                      flex-grow: 1;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <div v-if="rewardsClaimed || rewardsLeft">
                      <apexchart
                        ref="rewardPoolLeftChart"
                        style="width: 100%"
                        height="300px"
                        :series="[rewardsClaimed * 100, rewardsLeft * 100]"
                        :options="{
                          labels: ['Rewards Claimed', 'Rewards Left'],
                          colors: ['#9eca7e', '#5a6fc0'],
                          chart: { type: 'donut' },
                          legend: { position: 'bottom' },
                        }"
                      ></apexchart>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { CampaignAnalyticsDto } from "@/common/dto/CampaignAnalyticsDto.js";
import moment from "moment";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      interactionsRange: "all",
      chartLoading: false,
      loading: false,
      analytics: new CampaignAnalyticsDto(),
      option: null,
      campaignId: this.$route.params.id,
      interactionsOptions: {
        colors: ["#EDC16C"],

        theme: {
          mode: "light",
        },
        title: {
          text: "Interactions",
          align: "left",
        },
        xaxis: {
          categories: [],
          labels: {
            hideOverlappingLabels: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
          },
        },
      },
      interactionsSeries: [
        {
          name: "Interactions",
          data: [],
        },
      ],
    };
  },
  computed: {
    totalRewardsPool() {
      return (
        Number(this.campaign.rewardPoolTokenCount) /
        Number(Math.pow(10, this.campaign.rewardPoolDecimal))
      );
    },
    rewardsClaimed() {
      return (
        Math.round(
          (this.analytics.rewardsDistributed /
            Number(Math.pow(10, this.campaign.rewardPoolDecimal))) *
            1000
        ) / 1000
      );
    },
    rewardsLeft() {
      return (
        Math.round(
          (Number(this.campaign.rewardPoolTokenCount) /
            Number(Math.pow(10, this.campaign.rewardPoolDecimal)) -
            this.analytics.rewardsDistributed /
              Number(Math.pow(10, this.campaign.rewardPoolDecimal))) *
            1000
        ) / 1000
      );
    },
    campaign() {
      return this.$store.getters["Campaign/getCampaign"](this.campaignId);
    },
    categories() {
      return this.campaign.categories.map(
        this.$store.getters["Category/getCategory"]
      );
    },
  },
  watch: {
    async interactionsRange(newValue, oldValue) {
      if (newValue !== oldValue && newValue !== "") {
        let periodFrom = moment().startOf("day").utc();
        let periodTo = moment().endOf("day").utc();
        switch (newValue) {
          case "day":
            break;
          case "week":
            periodFrom.subtract(7, "days");
            break;
          case "month":
            periodFrom.subtract(32, "days");
            break;
          case "all":
            periodFrom = moment(this.campaign.timeFrameFrom);
            periodTo = moment(this.campaign.timeFrameTill);
            break;
        }
        await this.getCampaignInteractions(periodFrom.unix(), periodTo.unix());
      }
    },
  },
  async created() {
    this.loading = true;
    if (this.campaign === null) {
      await this.$store.dispatch("Campaign/loadCampaigns");
    }
    if (this.campaignId) {
      const campaignAnalytics = await this.$store.dispatch(
        "Campaign/loadCampaignAnalytics",
        this.campaignId
      );

      this.analytics = campaignAnalytics.data;
      this.updateChart(this.analytics.campaignInteractions);
    }

    this.loading = false;
  },
  methods: {
    async getCampaignInteractions(periodFrom, periodTo) {
      this.chartLoading = true;
      let data = {
        from: periodFrom,
        to: periodTo,
      };
      const result = await this.$store.dispatch(
        "Campaign/loadCampaignAnalyticsInteractions",
        {
          campaignId: this.campaign.id,
          data: data,
        }
      );
      this.updateChart(result.data);
      this.chartLoading = false;
    },
    updateChart(chartData) {
      let keys = Object.keys(chartData.interactions).sort();

      this.interactionsSeries[0].data.length = 0;
      this.interactionsOptions.xaxis.categories.length = 0;

      let dateFormat = "";
      if (chartData.mode === "hour") {
        dateFormat = "HH:00";
      } else if (chartData.mode === "day") {
        dateFormat = "MMM DD";
      } else {
        dateFormat = "MMM YYYY";
      }

      for (let key of keys) {
        let date = moment(key).format(dateFormat);
        let interactionsPerDate = chartData.interactions[key];

        this.interactionsSeries[0].data.push(
          interactionsPerDate == null ? 0 : interactionsPerDate
        );
        this.interactionsOptions.xaxis.categories.push(date);
      }
    },
  },
};
</script>

<style lang="scss">
@use "@/design/vars.scss" as v;

.analytics-card {
  &.yellow {
    background-color: v.$color-primary-light-9;
  }

  .el-card__body {
    padding-top: 0.5em;
    padding-left: 2em;
  }
}
</style>

<style scoped lang="scss"></style>
