<template>
  <el-collapse v-model="activityValue" accordion>
    <el-collapse-item
      v-for="activityObject in activities"
      :key="activityObject.hash"
      :name="activityObject.hash"
    >
      <template #title>
        {{ activityObject.name }} - {{ activityObject.hash }}
      </template>

      <el-row
        v-for="actionObject in activityObject.actions"
        :key="actionObject.hash"
        justify="space-between"
      >
        <el-col :span="-1">
          {{ actionObject.name }}
          <br />
          {{ actionObject.hash }} (function hash)
        </el-col>

        <el-col :span="-1">
          <input
            v-model="actionValue"
            type="radio"
            :value="actionObject.hash"
          />
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
      default: () => ({}),
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
      activityValue: this.activity,
      actionValue: this.action,
      activities: [],
    };
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
  },
  created() {
    this.loadActivities();
  },
  methods: {
    async loadActivities() {
      this.loading = true;

      const activitiesResponse = await this.$store.dispatch(
        "Activity/queryActivities",
        this.filters
      );

      if (!activitiesResponse.success) {
        return;
      }

      this.activities = activitiesResponse.data;

      this.loading = false;
    },
  },
};
</script>
