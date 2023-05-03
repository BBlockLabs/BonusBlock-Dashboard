<template>
  <el-space class="avatar-select" wrap>
    <template v-for="avatar in avatars" :key="avatar">
      <img
        :src="'data:image/svg+xml;base64,' + avatar"
        alt=""
        :class="{ selected: file.data === avatar }"
        @click="selectAvatar(avatar)"
      />
    </template>
  </el-space>
</template>

<script>
import SvgAvatar1 from "@/assets/bblock/avatar1.svg?raw";
import SvgAvatar2 from "@/assets/bblock/avatar2.svg?raw";
import SvgAvatar3 from "@/assets/bblock/avatar3.svg?raw";
import SvgAvatar4 from "@/assets/bblock/avatar4.svg?raw";
import SvgAvatar5 from "@/assets/bblock/avatar5.svg?raw";
import SvgAvatar6 from "@/assets/bblock/avatar6.svg?raw";

export default {
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      file: this.modelValue,
      avatars: [
        window.btoa(SvgAvatar1),
        window.btoa(SvgAvatar2),
        window.btoa(SvgAvatar3),
        window.btoa(SvgAvatar4),
        window.btoa(SvgAvatar5),
        window.btoa(SvgAvatar6),
      ],
    };
  },
  watch: {
    modelValue() {
      this.file = this.modelValue;
    },
    file() {
      this.$emit("update:modelValue", this.file);
    },
  },
  methods: {
    selectAvatar(b64) {
      this.file.data = b64;
      this.file.type = "image/svg+xml";
    },
  },
};
</script>

<style lang="scss">
@use "@/design/vars.scss" as v;

.avatar-select {
  img {
    cursor: pointer;
    border-radius: 19px;
    border: 3px solid #ffffff;
    &.selected {
      border-color: v.$color-avatar-selected;
    }
  }
}
</style>
