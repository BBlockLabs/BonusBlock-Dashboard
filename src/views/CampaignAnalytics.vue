<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <el-container class="h-100" style="padding-left: 20px">
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
                  <el-tab-pane label="Month" name="month"></el-tab-pane>
                  <el-tab-pane label="Week" name="week"></el-tab-pane>
                  <el-tab-pane label="Today" name="today"></el-tab-pane>
                </el-tabs>
              </el-col>
              <!--              <el-col :span="-1">
                              <el-button class="ml-4" type="default">Set custom period</el-button>
                            </el-col>-->
            </el-row>
            <el-row>
              <el-col
                v-loading="chartLoading[interactionsRange]"
                :md="12"
                style="min-height: 20em"
              >
                <apexchart
                  v-if="interactionsSeries[0].data.length > 0"
                  ref="interactionsChart"
                  style="width: 100%; height: 100%"
                  height="100%"
                  type="bar"
                  :options="interactionsOptions"
                  :series="interactionsSeries"
                ></apexchart>
                <div v-else>No data yet</div>
              </el-col>
              <el-col v-loading="analyticsLoading" :md="12" class="pl-3">
                <el-card class="analytics-card yellow" shadow="never">
                  <el-row class="d-flex mt-3 mb-4">
                    <el-col
                      ><strong style="font-size: 1.2em"
                        >Total rewards pool</strong
                      ></el-col
                    >
                  </el-row>
                  <template v-if="campaign">
                    <strong style="font-size: 3em">{{
                      totalRewardsPool
                    }}</strong>
                    &nbsp;<strong style="font-size: 2em">{{
                      campaign.rewardPoolCurrencyName
                    }}</strong>
                  </template>
                </el-card>
                <div style="display: flex">
                  <div style="flex-grow: 1">
                    <el-card class="analytics-card mt-3">
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
                          {{ campaignRewardsClaimedPercent ?? "&nbsp;" }}
                        </el-col>
                      </el-row>
                      <template v-if="campaignAndAnalyticsLoaded">
                        <strong style="font-size: 3em">{{
                          rewardsClaimed
                        }}</strong>
                        &nbsp;<strong style="font-size: 2em">{{
                          campaign.rewardPoolCurrencyName
                        }}</strong>
                      </template>
                      <strong v-else style="font-size: 3em">&nbsp;</strong>
                    </el-card>
                    <el-card class="analytics-card mt-3">
                      <el-row
                        class="d-flex mt-3 mb-4"
                        style="
                          flex-wrap: nowrap;
                          justify-content: space-between;
                        "
                      >
                        <el-col :span="18">
                          <strong style="font-size: 1.2em">Rewards left</strong>
                        </el-col>
                        <el-col :span="4" style="text-align: right">
                          {{ campaignRewardsLeftPercent ?? "&nbsp;" }}
                        </el-col>
                      </el-row>
                      <template v-if="campaignAndAnalyticsLoaded">
                        <strong style="font-size: 3em">
                          {{ rewardsLeft }}
                        </strong>
                        &nbsp;<strong style="font-size: 2em">{{
                          campaign.rewardPoolCurrencyName
                        }}</strong>
                      </template>
                      <strong v-else style="font-size: 3em">&nbsp;</strong>
                    </el-card>
                  </div>
                  <div
                    class="mt-3 ml-3"
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <div style="height: 300px">
                      <apexchart
                        v-if="campaignAndAnalyticsLoaded"
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
      interactionsRange: "today",
      chartLoading: {},
      analyticsLoading: false,
      analytics: new CampaignAnalyticsDto(),
      option: null,
      campaignId: this.$route.params.id,
      interactionsCache: {},
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
          categories: [""],
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
          data: [0],
        },
      ],
    };
  },
  computed: {
    campaignAndAnalyticsLoaded() {
      return this.campaign && this.analytics.campaignCost !== 0;
    },
    totalRewardsPool() {
      return (
        Number(this.campaign.rewardPoolTokenCount) /
        Number(Math.pow(10, this.campaign.rewardPoolDecimal))
      );
    },
    campaignRewardsClaimedPercent() {
      if (!this.campaignAndAnalyticsLoaded) {
        return "";
      }
      let prc =
        Math.round(
          (Number(this.analytics.rewardsDistributed) /
            Number(this.campaign.rewardPoolTokenCount)) *
            100 *
            100
        ) / 100;
      return prc + "%";
    },
    campaignRewardsLeftPercent() {
      if (!this.campaignAndAnalyticsLoaded) {
        return "";
      }
      let prc =
        100 -
        Math.round(
          (Number(this.analytics.rewardsDistributed) /
            Number(this.campaign.rewardPoolTokenCount)) *
            100 *
            100
        ) /
          100;
      return prc + "%";
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
      return this.campaign.categories ? this.campaign.categories.map(
        this.$store.getters["Category/getCategory"]
      ) : [];
    },
  },
  watch: {
    interactionsRange(newValue, oldValue) {
      if (newValue !== oldValue && newValue !== "") {
        this.fetchCampaignInteractions();
      }
    },
  },
  created() {
    // make two queries in parallel! no await here!
    this.fetchAnalytics().then(() => {});
    this.fetchCampaignInteractions().then(() => {});
  },
  methods: {
    async fetchAnalytics() {
      this.analyticsLoading = true;
      if (this.campaign === null) {
        await this.$store.dispatch("Campaign/loadCampaigns");
      }
      if (this.campaignId) {
        const campaignAnalytics = await this.$store.dispatch(
          "Campaign/loadCampaignAnalytics",
          this.campaignId
        );

        this.analytics = campaignAnalytics.data;
      }
      this.analyticsLoading = false;
    },
    parseChartRange(range) {
      let from = null;
      if (range !== "all") {
        let periodFrom = moment().startOf("day").utc();
        switch (range) {
          case "today":
            break;
          case "week":
            periodFrom.subtract(7, "days");
            break;
          case "month":
            periodFrom.subtract(32, "days");
            break;
          case "year":
            periodFrom.subtract(1, "year");
            break;
        }
        from = periodFrom.unix();
      }
      return {
        from: from,
        to: null,
      };
    },
    async fetchCampaignInteractions() {
      let queriedRange = this.interactionsRange;
      let query = this.parseChartRange(queriedRange);
      let cacheKey = query.from + "-" + query.to;
      if (this.interactionsCache[cacheKey]) {
        this.updateChart(this.interactionsCache[cacheKey].data);
        if (
          moment().diff(this.interactionsCache[cacheKey].time) <
          1000 * 60 * 5
        ) {
          return;
        }
      }
      if (this.chartLoading[queriedRange]) {
        return;
      }
      this.chartLoading[queriedRange] = true;
      let chartData = null;
      try {
        const result = await this.$store.dispatch(
          "Campaign/loadCampaignAnalyticsInteractions",
          {
            campaignId: this.campaignId,
            data: query,
          }
        );
        this.interactionsCache[cacheKey] = {
          time: moment(),
          data: result.data,
        };
        chartData = result.data;
      } catch (e) {
        console.log(e);
      }
      if (this.interactionsRange === queriedRange) {
        this.updateChart(chartData);
      }
      this.chartLoading[queriedRange] = false;
    },
    updateChart(chartData) {
      this.interactionsSeries[0].data.length = 0;
      this.interactionsOptions.xaxis.categories.length = 0;

      if (!chartData) {
        return;
      }

      let dateFormat = "";
      if (chartData.mode === "hour") {
        dateFormat = "HH:00";
      } else if (chartData.mode === "day") {
        dateFormat = "MMM DD";
      } else {
        dateFormat = "MMM YYYY";
      }

      let keys = Object.keys(chartData.interactions).sort();
      for (let key of keys) {
        let date = moment(key).format(dateFormat);
        let interactionsPerDate = chartData.interactions[key];

        this.interactionsSeries[0].data.push(interactionsPerDate ?? 0);
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
