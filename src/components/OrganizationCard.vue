<template>
  <el-card
    :class="{
      'is-hover-shadow': $props.static === false,
      'is-pointer': $props.static === false,
    }"
    shadow="never"
    class="organization-card"
  >
    <img
      src="@/assets/images/0aa43a2a3f8bc06a5d76b74d53029eaa.jpeg"
      class="image"
      :alt="organization.name"
    />
    <div class="avatar">
      <avatar />
    </div>
    <el-row justify="center" align="top">
      <el-col :span="11" class="align-left">
        <h4 class="m-0">
          {{ organization.name }}
        </h4>
        {{ organization.url }}
      </el-col>
      <el-col :span="11" class="align-right">
        <h2 class="m-0">
          {{ organization.serversCount }}
        </h2>
        servers
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import Avatar from "@/components/AvatarImage.vue";
import Organization from "@/state/models/Organization";

export default {
  components: {
    Avatar,
  },
  props: {
    organization: {
      type: [Organization, Object],
      default: () => new Organization(),
    },
    static: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.organization-card {
  &.is-pointer {
    cursor: pointer;
  }
  .el-card__body {
    padding: 0;

    .image {
      width: 100%;
      height: 8.25em;
      object-fit: cover;
    }
    .avatar {
      position: relative;
      left: 1.75em;
      top: -1.75em;
      float: left;
    }
    .el-row {
      top: -1.5em;
      width: 100%;
    }
  }
}
</style>
