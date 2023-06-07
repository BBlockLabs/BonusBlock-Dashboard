<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <el-container class="h-100" style="padding-left: 20px">
      <el-main class="pos-relative">
        <div class="pos-absolute w-100">
          <div style="margin-right: 20px; margin-top: 20px">
            <el-row class="is-justify-space-between" style="gap: 0.5em">
              <el-col :span="-1">
                <h1 class="m-0">
                  {{ campaign ? campaign.name : "" }} campaign Analytics
                </h1>
                <el-row class="mt-1" align="middle">
                  <el-col :span="-1">
                    <b>Product:</b> {{ campaign ? campaign.name : "" }}
                  </el-col>
                  <el-col :span="-1" class="ml-3">
                    <b>Categories:</b>
                  </el-col>
                  <el-col v-if="campaign" :span="-1">
                    <el-tag
                      v-for="tag in campaign.tags"
                      :key="tag"
                      class="mx-1"
                      round
                    >
                      {{ tag }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="-1">
                <!--                <el-button type="primary"> Export Data</el-button>-->
                <router-link v-if="campaign" :to="`/campaign/${campaign.id}/edit`">
                  <el-button type="primary"> Manage Campaign</el-button>
                </router-link>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :md="12"
                style="min-height: 20em"
              >
                <el-row align="middle" justify="space-between">
                  <h3>Interactions</h3>
                  <div v-if="todayInteractions !== null" class="mr-3">
                    Today interactions: <strong>{{ todayInteractions }}</strong>
                  </div>
                </el-row>
                <el-row align="middle">
                  <el-col class="mt-1" :span="-1">
                    <el-tabs v-model="interactionsRange">
                      <el-tab-pane label="Year" name="year"></el-tab-pane>
                      <el-tab-pane label="Month" name="month"></el-tab-pane>
                      <el-tab-pane label="Week" name="week"></el-tab-pane>
                      <el-tab-pane label="Day" name="day"></el-tab-pane>
                    </el-tabs>
                  </el-col>
                  <el-col :span="-1" class="ml-auto">
                    <el-row align="middle" class="chart-navigation">
                      <svg-chevron-left
                        class="prevent-select"
                        :class="{ disabled: !hasPrevRange }"
                        @click="jumpBy(1)"
                      />
                      <strong>{{ currentRangeName }}</strong>
                      <svg-chevron-right
                        class="prevent-select"
                        :class="{ disabled: !hasNextRange }"
                        @click="jumpBy(-1)"
                      />
                    </el-row>
                  </el-col>
                </el-row>
                <apexchart
                  v-if="interactionsSeries[0].data.length > 0"
                  v-loading="chartLoading[interactionsRange + chartOffset]"
                  ref="interactionsChart"
                  style="width: 100%; height: 100%"
                  height="100%"
                  type="bar"
                  :options="interactionsOptions"
                  :series="interactionsSeries"
                ></apexchart>
                <div v-else class="mt-3 ml-2">No data yet</div>
              </el-col>
              <el-col v-loading="analyticsLoading" :md="12" class=" pl-3 d-flex flex-column justify-content-center">
                <el-card class="analytics-card yellow" shadow="never">
                  <el-row class="d-flex mt-3 mb-4">
                    <el-col>
                      <strong style="font-size: 1.2em">Total rewards pool</strong>
                    </el-col>
                  </el-row>
                  <template v-if="campaign">
                    <strong style="font-size: 3em">{{ totalRewardsPool }}</strong>
                    &nbsp;<strong style="font-size: 2em">{{ campaign.rewardPoolCurrencyName }}</strong>
                  </template>
                </el-card>
                <div class="mt-3" style="display: flex; gap: 1em" :style="{flexDirection: $mq.sm ? 'column' : 'row'}">
                  <div style="flex-grow: 1">
                    <el-card class="analytics-card mb-3">
                      <el-row
                        class="d-flex mt-3 mb-4 flex-nowrap"
                        justify="space-between"
                        style="gap: 0.5em"
                      >
                        <el-col :span="-1">
                          <strong style="font-size: 1.2em">Rewards claimed</strong>
                        </el-col>
                        <el-col :span="-1" class="ml-auto" style="text-align: right">
                          {{ campaignRewardsClaimedPercent ?? "&nbsp;" }}
                        </el-col>
                      </el-row>
                      <template v-if="campaignAndAnalyticsLoaded">
                        <strong style="font-size: 3em">{{ rewardsClaimed }}</strong>
                        &nbsp;<strong style="font-size: 2em">{{ campaign.rewardPoolCurrencyName }}</strong>
                      </template>
                      <strong v-else style="font-size: 3em">&nbsp;</strong>
                    </el-card>
                    <el-card class="analytics-card mb-3">
                      <el-row
                        class="d-flex mt-3 mb-4 flex-nowrap"
                        justify="space-between"
                        style="gap: 0.5em"
                      >
                        <el-col :span="-1">
                          <strong style="font-size: 1.2em">Rewards left</strong>
                        </el-col>
                        <el-col :span="-1" class="ml-auto" style="text-align: right">
                          {{ campaignRewardsLeftPercent ?? "&nbsp;" }}
                        </el-col>
                      </el-row>
                      <template v-if="campaignAndAnalyticsLoaded">
                        <strong style="font-size: 3em">
                          {{ rewardsLeft }}
                        </strong>
                        &nbsp;<strong style="font-size: 2em">{{ campaign.rewardPoolCurrencyName }}</strong>
                      </template>
                      <strong v-else style="font-size: 3em">&nbsp;</strong>
                    </el-card>
                  </div>
                  <div style="display: flex; justify-content: center; align-items: center">
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
import SvgChevronLeft from "@/assets/icons/nav-arrow-left.svg";
import SvgChevronRight from "@/assets/icons/nav-arrow-right.svg";

export default {
  components: {
    apexchart: VueApexCharts,
    SvgChevronLeft,
    SvgChevronRight,
  },
  data() {
    return {
      interactionsRange: "day",
      chartOffset: 0,
      chartLoading: {},
      analyticsLoading: false,
      analytics: new CampaignAnalyticsDto(),
      option: null,
      campaignId: this.$route.params.id,
      todayInteractions: null,
      interactionsCache: {},
      interactionsOptions: {
        colors: ["#EDC16C"],
        chart: {
          animations: {
            speed: 400,
          },
          toolbar: {
            show: false,
          },
        },
        theme: {
          mode: "light",
        },
        xaxis: {
          categories: [""],
          labels: {
            hideOverlappingLabels: true,
          },
        },
        tooltip: {
          x: {
            formatter: this.tooltipXFormatter,
          },
          y: {
            formatter: this.tooltipYFormatter,
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
    lowestOffset() {
      let endDate = this.campaign?.timeFrameTill;
      if (!endDate) {
        return 0;
      }
      const diff = moment()
        .startOf(this.interactionsRange)
        .diff(endDate, this.interactionsRange, true);
      return diff > 0 ? Math.ceil(diff) : 0;
    },
    currentRangeStart() {
      return moment()
        .subtract(this.chartOffset, this.interactionsRange)
        .startOf(this.interactionsRange);
    },
    currentRangeEnd() {
      return moment()
        .subtract(this.chartOffset, this.interactionsRange)
        .endOf(this.interactionsRange);
    },
    currentRangeName() {
      let rangeEnd = this.currentRangeStart;
      switch (this.interactionsRange) {
        case "day":
          return rangeEnd.format("MMMM Do");
        case "week":
          return this.nth(this.weekOfMonth(rangeEnd)) + " week of " + rangeEnd.format("MMMM");
        case "month":
          return rangeEnd.format("MMMM");
        case "year":
          return rangeEnd.format("YYYY");
      }
      return "";
    },
    hasPrevRange() {
      let startDate = this.campaign?.timeFrameFrom;
      if (!startDate) {
        return true;
      }
      return this.currentRangeStart.isAfter(startDate);
    },
    hasNextRange() {
      if (this.chartOffset <= 0) {
        return false;
      }
      let endDate = this.campaign?.timeFrameTill;
      if (!endDate) {
        return true;
      }
      return this.currentRangeEnd.isBefore(endDate);
    },
  },
  watch: {
    interactionsRange(newValue, oldValue) {
      if (newValue !== oldValue && newValue !== "") {
        this.chartOffset = this.lowestOffset;
        this.fetchCampaignInteractions();
      }
    },
    chartOffset(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.fetchCampaignInteractions();
      }
    },
    campaign() {
      let startDate = this.campaign?.timeFrameFrom;
      if (startDate && this.currentRangeEnd.isBefore(startDate)) {
        const diff = this.currentRangeEnd.diff(startDate, this.interactionsRange, true);
        this.jumpBy(Math.floor(diff));
      }

      let endDate = this.campaign?.timeFrameTill;
      if (endDate && this.currentRangeStart.isAfter(endDate)) {
        const diff = this.currentRangeStart.diff(endDate, this.interactionsRange, true);
        this.jumpBy(Math.ceil(diff));
      }
    }
  },
  created() {
    this.chartOffset = this.lowestOffset;
    // make queries in parallel! no await here!
    this.fetchAnalytics().then(() => {});
    this.fetchTodayInteractions().then(() => {});
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
    async fetchTodayInteractions() {
      const result = await this.$store.dispatch(
        "Campaign/loadCampaignAnalyticsInteractions",
        {
          campaignId: this.campaignId,
          data: {
            from: moment().startOf("day").unix(),
            to: moment().endOf("day").unix(),
            timeZoneOffset: new Date().getTimezoneOffset() * -1,
          }
        }
      );
      if (result.data) {
        for (let k in result.data.interactions) {
          this.todayInteractions = result.data.interactions[k];
          break;
        }
      }
    },
    async fetchCampaignInteractions() {
      const truncateSettings = {
        day: "hours",
        week: "days",
        month: "days",
        year: "months",
      };
      let queriedRange = this.interactionsRange;
      let queriedOffset = this.chartOffset;
      let query = {
        from: this.currentRangeStart.unix(),
        to: this.currentRangeEnd.unix(),
        truncateTo: truncateSettings[this.interactionsRange],
        timeZoneOffset: new Date().getTimezoneOffset() * -1,
      };
      let cacheKey = query.from + "-" + query.to + "-" + query.truncateTo;
      if (this.interactionsCache[cacheKey]) {
        this.updateChart(this.interactionsCache[cacheKey].data);
        if (
          moment().diff(this.interactionsCache[cacheKey].time) <
          1000 * 60 * 5
        ) {
          return;
        }
      }
      if (this.chartLoading[queriedRange + queriedOffset]) {
        return;
      }
      this.chartLoading[queriedRange + queriedOffset] = true;
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
      if (this.interactionsRange === queriedRange && this.chartOffset === queriedOffset) {
        this.updateChart(chartData);
      }
      this.chartLoading[queriedRange + queriedOffset] = false;
    },
    updateChart(chartData) {
      this.interactionsSeries[0].data.length = 0;
      this.interactionsOptions.xaxis.categories.length = 0;

      if (!chartData) {
        return;
      }

      let from = moment(chartData.from);
      let to = moment(chartData.to);
      let startDate = this.campaign?.timeFrameFrom;
      let endDate = this.campaign?.timeFrameTill;
      if (startDate && from.isBefore(startDate)) {
        from = moment(startDate);
      }
      if (endDate && to.isAfter(endDate)) {
        to = moment(endDate);
      }

      let dateFormat = "";
      if (chartData.truncateTo === "hours") {
        dateFormat = "[\u00A0]HH:00[\u00A0]";
      } else if (chartData.truncateTo === "days") {
        dateFormat = to.diff(from, "days") > 8 ? "DD" : "dddd";
      } else {
        dateFormat = "MMM";
      }

      let samples = {};
      for (let key in chartData.interactions) {
        let formattedDate = moment(key).format(dateFormat);
        samples[formattedDate] = chartData.interactions[key] ?? 0;
      }

      let date = from.clone();
      while (date.diff(to) < 0) {
        let formattedDate = moment(date).format(dateFormat);
        this.interactionsSeries[0].data.push(samples[formattedDate] ?? 0);
        this.interactionsOptions.xaxis.categories.push(formattedDate);
        date.add(1, chartData.truncateTo);
      }
    },
    nth(d) {
      if (d > 3 && d < 21) return d + "th";
      switch (d % 10) {
        case 1:
          return d + "st";
        case 2:
          return d + "nd";
        case 3:
          return d + "rd";
        default:
          return d + "th";
      }
    },
    weekOfMonth(input) {
      const firstDayOfMonth = input.clone().startOf("month");
      const firstDayOfWeek = firstDayOfMonth.clone().startOf("week");
      const offset = firstDayOfMonth.diff(firstDayOfWeek, "days");
      return Math.ceil((input.date() + offset) / 7);
    },
    jumpBy(offset) {
      if (offset > 0 && !this.hasPrevRange) {
        return;
      }
      this.chartOffset = Math.max(this.lowestOffset, this.chartOffset + offset);
    },
    tooltipXFormatter(label) {
      switch (this.interactionsRange) {
        case "day":
          return label + " - " + this.currentRangeStart.format("MMMM Do, YYYY");
        case "week":
          return label + " - " + this.currentRangeStart.format("MMMM, YYYY");
        case "month":
          return this.currentRangeStart.format("MMMM [" + this.nth(parseInt(label)) + "], YYYY");
      }
      return label;
    },
    tooltipYFormatter(value) {
      return value.toFixed(0);
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

  @media only screen and (max-width: 768px) {
    font-size: 0.8em;
  }
}
</style>

<style scoped lang="scss"></style>
