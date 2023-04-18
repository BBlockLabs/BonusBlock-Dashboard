<template>
  <el-upload
    v-model:file-list="fileList"
    class="banner-upload"
    drag
    :limit="1"
    :auto-upload="false"
    :show-file-list="false"
    :on-remove="
      () => {
        value = null;
      }
    "
  >
    <img
      v-if="value"
      :src="FileParser.fileObjectSrc(value)"
      class="h-100 w-100"
    />

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
import { FileObject } from "@/common/FileObject.js";
import FileParser from "@/common/FileParser.js";
import Toast from "@/mixins/Toast.js";

export default {
  mixins: [Toast],
  props: {
    modelValue: {
      type: FileObject,
      default: () => new FileObject(),
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: this.modelValue,
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
    modelValue: {
      deep: true,
      handler() {
        this.value = this.modelValue;
      },
    },
    value: {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.value);
      },
    },
  },
  methods: {
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
      console.log("setFileList");
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

      const fileObject = await FileParser.fileToFileObject(file);

      const image = await this.getImageFromFileObject(fileObject);

      if (!this.validateMinImageSize(image)) {
        invalidHandler("The banner must be no less than 1200x675 pixels!");

        return;
      }

      if (!this.validateAspectRatio(image)) {
        invalidHandler("The banner must be 16:9 Aspect ratio!");

        return;
      }

      this.value = fileObject;
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
     * @param {FileObject} fileObject
     * @returns {Promise<Image>}
     */
    async getImageFromFileObject(fileObject) {
      return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => {
          resolve(image);
        };

        image.src = FileParser.fileObjectSrc(fileObject);
      });
    },
  },
};
</script>

<style lang="scss">
@use "element-plus/theme-chalk/src/mixins/mixins" as EPMixins;
@use "element-plus/theme-chalk/src/mixins/function" as EPFunctions;

.banner-upload {
  @include EPMixins.b(upload) {
    aspect-ratio: 16/9;
  }

  @include EPMixins.b(upload-dragger) {
    padding: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
