<template>
  <el-upload
    class="avatar-uploader"
    drag
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
  >
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        Avatar must be jpg/png with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script>
import Toast from "@/mixins/Toast";
import FileParser from "@/common/FileParser.js";

export default {
  mixins: [Toast],
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      imageUrl: false,
      file: this.modelValue,
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
    beforeAvatarUpload(rawFile) {
      if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
        this.Toast("Picture must be JPG or PNG format!", "", "error", 1500);
        return false;
      }

      if (rawFile.size / 1024 > 500) {
        this.Toast("Picture size can not exceed 500kb", "", "error", 1500);
        return false;
      }

      FileParser.fileToFileObject(rawFile).then((fileObject) => {
        this.file = fileObject;
      });

      return false;
    },
  },
};
</script>

<style lang="scss">
.avatar-uploader {
  width: 100%;
  max-width: 430px;

  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
}
</style>
