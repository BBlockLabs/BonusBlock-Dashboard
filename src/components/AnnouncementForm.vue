<template>
  <el-form>
    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['banner'])"
      label="Banner"
    >
      <el-upload
        v-model:file-list="fileList"
        drag
        :limit="1"
        :auto-upload="false"
        :show-file-list="false"
        :on-remove="
          () => {
            value.banner = null;
          }
        "
        class="p-0"
        style="aspect-ratio: 16/9"
      >
        <img
          v-if="value.banner"
          :src="FileParser.fileObjectSrc(value.banner)"
          class="h-100 w-100"
        />

        <div v-else class="el-upload__text h-100">
          Drop file here or <em>click to upload</em>
        </div>

        <template #tip>
          <div class="el-upload__tip">
            The banner must be 16:9 Aspect ratio and no less than 1200x675
            pixels. PNG or JPG only. No transparency.
          </div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['title'])"
      label="Title"
    >
      <el-input v-model="value.title" placeholder="Please input" />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['description'])
      "
      label="Description"
    >
      <el-input v-model="value.description" type="textarea" />
    </el-form-item>

    <el-form-item
      v-for="(social, idx) in value.socials"
      :key="idx"
      v-bind="
        validate['socials'][idx]
          ? ValidationHelper.getFormItemErrorAttributes(
              validate['socials'][idx]
            )
          : {}
      "
      :label="`Social ${social.type || 'X'}`"
    >
      <social-input v-model="value.socials[idx]" />
    </el-form-item>
  </el-form>
</template>

<script>
import SocialInput from "@/components/SocialInput.vue";
import AnnouncementFormObject from "@/common/Form/AnnouncementFormObject.js";
import AnnouncementFormValidationBuilder from "@/common/validation/AnnouncementFormValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import FileParser from "@/common/FileParser.js";
import Toast from "@/mixins/Toast.js";

export default {
  components: {
    SocialInput,
  },
  mixins: [Toast],
  props: {
    modelValue: {
      type: AnnouncementFormObject,
      default: () => new AnnouncementFormObject(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["modelValue:update"],
  data() {
    return {
      value: this.modelValue,
    };
  },
  computed: {
    FileParser: () => FileParser,
    ValidationHelper: () => ValidationHelper,
    fileList: {
      get() {
        if (this.value.banner === null) {
          return [];
        }

        return [
          {
            name: "File",
            url: FileParser.fileObjectSrc(this.value.banner),
          },
        ];
      },
      async set(uploadUserFileList) {
        const uploadUserFile =
          uploadUserFileList[uploadUserFileList.length - 1];

        if (!uploadUserFile) {
          this.value.banner = null;

          return;
        }

        if (!uploadUserFile.raw) {
          // File is url from stored object
          return;
        }

        if (!(await this.fileUpload(uploadUserFile.raw))) {
          uploadUserFileList.pop();
        }
      },
    },
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = AnnouncementFormValidationBuilder.createValidation(
        this.modelValue
      ).value;

      validation.$lazy = true;
      validation.$touch();

      return validation;
    },
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.$emit("modelValue:update", this.value);
      },
    },
    modelValue: {
      deep: true,
      handler() {
        this.value = this.modelValue;
      },
    },
  },
  methods: {
    async fileUpload(file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.Toast("Picture must be JPG or PNG format!", "", "error", 5000);

        this.value.banner = null;

        return false;
      }

      const fileObject = await FileParser.fileToFileObject(file);

      const image = new Image();

      return new Promise((resolve) => {
        image.onload = () => {
          if (image.width < 1200 || image.height < 675) {
            this.Toast(
              "The banner must be no less than 1200x675 pixels!",
              "",
              "error",
              5000
            );

            this.value.banner = null;

            resolve(false);
            return;
          }

          if (
            image.width % 16 !== 0 ||
            image.height % 9 !== 0 ||
            image.width / 16 !== image.height / 9
          ) {
            this.Toast(
              "The banner must be 16:9 Aspect ratio!",
              "",
              "error",
              5000
            );

            this.value.banner = null;

            resolve(false);
            return;
          }

          this.value.banner = fileObject;

          resolve(true);
        };

        image.src = FileParser.fileObjectSrc(fileObject);
      });
    },
  },
};
</script>
