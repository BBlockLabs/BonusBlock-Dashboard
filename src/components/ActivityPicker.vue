<template>
  <el-input
    v-model="filterString"
    placeholder="Search for activity"
    class="mb-3"
  />

  <el-collapse
    v-model="activityValue"
    v-infinite-scroll="netxPage"
    accordion
    class="of-scroll w-100 b-solid br-base"
    style="max-height: 500px"
  >
    <el-collapse-item
      v-for="activityObject in activities"
      :key="activityObject.id"
      :name="activityObject.id"
      class="bb-solid"
    >
      <template #title>
        <div class="d-flex flex-column p-3">
          <b>{{ activityObject.name }}</b>
          <span class="text-secondary">
            {{ activityObject.hash }}
          </span>
        </div>
      </template>

      <el-row
        v-for="actionId in activityObject.actions"
        :key="actionId"
        justify="space-between"
        class="bt-solid px-3 py-2"
      >
        <el-col
          :span="-1"
          class="d-flex flex-column pointer"
          @click="actionValue = actionId"
        >
          {{ Formatter.splitWordByCase($store.getters["Activity/getAction"](actionId).name) }}
          <span class="text-secondary">
            {{ $store.getters["Activity/getAction"](actionId).hash }} (function hash)
          </span>
        </el-col>

        <!--el-col :span="-1" class="d-flex">
          <input
            v-model="actionValue"
            class="my-auto"
            type="radio"
            :value="actionId"
          />
        </el-col-->
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import Toast from "@/mixins/Toast.js";
import { Formatter } from "@/common/Formatter.js";

export default {
  mixins: [Toast],
  props: {
    product: {
      type: String,
      require: true,
      default: "",
    },
    network: {
      type: String,
      require: true,
      default: "",
    },
    activity: {
      type: [String, null],
      required: true,
    },
    action: {
      type: [String, null],
      required: true,
    },
  },
  emits: ["update:activity", "update:action"],
  data() {
    return {
      loading: false,
      filterString: "",
      activityValue: this.activity,
      actionValue: this.action,
      page: 1,
      perPage: 20,
      lastPage: false,
    };
  },
  computed: {
    Formatter() {
      return Formatter;
    },
    activities() {
      return this.$store.getters["Activity/queryActivities"](
        this.network,
        this.product,
        this.filterString
      );
    },
  },
  watch: {
    activity() {
      this.activityValue = this.activity;
    },
    action() {
      this.actionValue = this.action;
    },
    activityValue() {
      this.$emit("update:activity", this.activityValue);
    },
    actionValue() {
      this.$emit("update:action", this.actionValue);
    },
    product() {
      this.resetActivities();
    },
    network() {
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
    netxPage() {
      if (this.lastPage) {
        return;
      }

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
          filter: this.filterString,
          page: this.page,
          perPage: this.perPage,
        }
      );

      if (!activitiesResponse.success) {
        this.Toast("Failed To load activities", "", "error");

        console.log(activitiesResponse.errors);

        return;
      }

      this.lastPage = activitiesResponse.data.length < this.perPage * this.page;

      this.loading = false;
    },
  },
};
</script>
