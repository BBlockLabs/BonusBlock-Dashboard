<template>
  <div
    v-infinite-scroll="() => nextPage()"
    v-loading="loading"
    class="br-base b-solid activity-picker"
    style="height: 500px"
  >
    <el-row
      v-for="(activity, idx) in activities"
      :key="activity.id"
      :class="{ 'bt-solid': idx !== 0 }"
    >
      <el-col class="p-3 pointer" :class="{'activity-selected' : activityValue === activity.id}">
        <label class="d-flex w-100 pointer">
          <el-avatar />
          <div class="mx-2 of-hidden my-auto">
            <el-tag>ETH</el-tag>&nbsp;
            <b>{{ activity.name }}</b>
            <br />
            0x{{ activity.hash }}
          </div>

          <div class="ml-auto my-auto">
            <span v-if="activity.url">
              <a :href="activity.url" target="_blank">
                <el-link>
                  <open-new-window class="icon" />
                </el-link>
              </a>
              &nbsp;
            </span>

            <el-radio v-model="activityValue" :label="activity.id" type="radio">
              &nbsp;
            </el-radio>
          </div>
        </label>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.activity-selected {
  background-color: var(--el-color-primary-light-9);
}

.activity-picker {
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>

<script>
import Toast from "@/mixins/Toast.js";
import OpenNewWindow from "@/assets/icons/open-new-window.svg";
import ActivityType from "@/common/ActivityType.js";

export default {
  components: {
    OpenNewWindow,
  },
  mixins: [Toast],
  props: {
    product: {
      type: String,
      require: true,
      default: "",
    },
    type: {
      type: ActivityType,
      require: true,
      default: "",
    },
    network: {
      type: String,
      require: true,
      default: "",
    },
    filterString: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, null],
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      loading: false,
      activityValue: this.modelValue,
      page: 1,
      perPage: 20,
      lastPage: false,
    };
  },
  computed: {
    activities() {
      return this.$store.getters["Activity/queryActivities"]({
        productId: this.product,
        type: this.type,
        selectedRewardedActivities: this.$store.getters[
          "RewardedActivity/getByCampaign"
        ](this.$route.params.id),
        queryString: this.filterString,
      });
    },
  },
  watch: {
    activity() {
      this.activityValue = this.modelValue;
    },
    activityValue() {
      this.$emit("update:modelValue", this.activityValue);
    },
    product() {
      this.resetActivities();
    },
    type() {
      this.resetActivities();
    },
    filterString() {
      this.resetActivities();
    },
  },
  created() {
    this.loadActivities();
  },
  methods: {
    nextPage() {
      if (this.lastPage || this.loading) {
        return;
      }

      this.loading = true;
      this.page++;

      this.loadActivities();
    },
    resetActivities() {
      this.page = 1;
      this.lastPage = false;
      this.loadActivities();
    },
    async loadActivities() {
      this.loading = true;

      const activitiesResponse = await this.$store.dispatch(
        "Activity/queryActivities",
        {
          product: this.product,
          network: this.network,
          type: this.type,
          filter: this.filterString,
          page: this.page,
          perPage: this.perPage,
        }
      );

      if (!activitiesResponse.success) {
        this.Toast("Failed To load activities", "", "error");

        return;
      }

      this.lastPage = activitiesResponse.data.length < this.perPage * this.page;

      this.loading = false;
    },
  },
};
</script>
