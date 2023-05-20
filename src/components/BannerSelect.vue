<template>
  <el-upload
    v-model:file-list="fileList"
    class="banner-upload"
    drag
    :limit="2"
    :auto-upload="false"
    :show-file-list="false"
    :on-remove="
      () => {
        value = null;
      }
    "
  >
    <img v-if="value" :src="fileUrl" class="banner-image w-100" alt="Banner" />

    <div v-else class="el-upload__text h-100">
      Drop file here or <em>click to upload</em>
    </div>

    <template #tip>
      <div class="el-upload__tip">
        The banner must be 16:9 Aspect ratio and no less than 1200x675 pixels.
        PNG or JPG only. No transparency.
      </div>
    </template>
  </el-upload>
</template>

<script>
import FileParser from "@/common/FileParser.js";
import Toast from "@/mixins/Toast.js";

export default {
  mixins: [Toast],
  props: {
    modelValue: {
      type: File,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: this.modelValue,
      fileUrl: null,
    };
  },
  computed: {
    FileParser() {
      return FileParser;
    },
    fileList: {
      get() {
        return this.getFileList();
      },
      set() {
        this.setFileList(...arguments);
      },
    },
  },
  watch: {
    modelValue() {
      this.value = this.modelValue;
      this.setFileUrl();
    },
    value() {
      this.$emit("update:modelValue", this.value);
      this.setFileUrl();
    },
  },
  created() {
    this.setFileUrl();
  },
  methods: {
    async setFileUrl() {
      if (!this.value) {
        this.fileUrl = null;

        return;
      }

      this.fileUrl = await FileParser.fileToBase64(this.value);
    },
    getFileList() {
      if (this.value === null) {
        return [];
      }

      return [
        {
          name: "File",
          url: FileParser.fileObjectSrc(this.value),
        },
      ];
    },
    async setFileList(uploadUserFileList) {
      if (uploadUserFileList.length === 0) {
        this.value = null;

        return;
      }

      const uploadUserFile = uploadUserFileList[uploadUserFileList.length - 1];

      if (!uploadUserFile.raw) {
        // File is url from stored object
        return;
      }

      const file = uploadUserFile.raw;

      const invalidHandler = (message) => {
        this.invalidFileHandle(message);

        uploadUserFileList.pop();
      };

      if (!this.validateFileType(file)) {
        invalidHandler("Picture must be JPG or PNG format!");

        return;
      }

      const image = await this.getImageFromFileObject(file);

      if (!this.validateMinImageSize(image)) {
        invalidHandler("The banner must be no less than 1200x675 pixels!");

        return;
      }

      /*if (!this.validateAspectRatio(image)) {
        invalidHandler("The banner must be 16:9 Aspect ratio!");

        return;
      }*/

      this.value = file;
    },
    invalidFileHandle(message) {
      this.Toast(message, "", "error", 5000);
      this.value = null;
    },
    /**
     * @param {File} file
     * @return {boolean}
     */
    validateFileType(file) {
      return file.type === "image/jpeg" || file.type === "image/png";
    },
    /**
     * @param {Image} image
     * @returns {boolean}
     */
    validateMinImageSize(image) {
      return image.width >= 1200 && image.height >= 675;
    },
    /**
     * @param {Image} image
     * @returns {boolean}
     */
    validateAspectRatio(image) {
      return (
        image.width % 16 === 0 &&
        image.height % 9 === 0 &&
        image.width / 16 === image.height / 9
      );
    },
    /**
     * @param {File} file
     * @returns {Promise<Image>}
     */
    async getImageFromFileObject(file) {
      const base64 = await FileParser.fileToBase64(file);

      return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => {
          resolve(image);
        };

        image.src = base64;
      });
    },
  },
};
</script>

<style lang="scss">
@use "element-plus/theme-chalk/src/mixins/mixins" as EPMixins;
@use "element-plus/theme-chalk/src/mixins/function" as EPFunctions;

.banner-upload {
  width: 100%;

  .banner-image {
    aspect-ratio: 16/9;
    object-fit: cover;
  }

  @include EPMixins.b(upload-dragger) {
    padding: 0;
    min-height: 30em;
    width: 100%;
  }
}
</style>
