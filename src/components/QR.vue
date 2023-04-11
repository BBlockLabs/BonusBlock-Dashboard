<template>
  <el-row justify="center">
    <el-col v-loading="loading">
      <img
        class="br-round w-100"
        :src="url"
        :alt="text"
      >
    </el-col>

    <el-col
      :span="-1"
      class="mt-3 of-hidden"
    >
      <div class="d-flex">
        <div
          class="float-l of-hidden"
        >
          {{ text }}
        </div>

        <el-button
          link
          type="primary"
          @click="copyToClipboard(text)"
        >
          <copy class="icon-large" />
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>


text-overflow: ellipsis;
width: 100%;
overflow: hidden;

<script>
import {Copy} from 'iconoir-vue';
import CopyToClipBoard from '@/mixins/CopyToClipBoard';
import { AwesomeQR } from 'awesome-qr';
import Logo from '@/assets/alter/ALTER.png';

export default {
  components: {
    Copy
  },
  mixins: [
    CopyToClipBoard,
  ],
  props: {
    text: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      /**
       * @see https://github.com/SumiMakito/Awesome-qr.js#readme
       * @return {Object}}
       */
      default: () => ({}),
    },
  },
  data() {
    return {
      url: '',
      loading: false,
    };
  },
  watch: {
    text() {
      this.generate();
    },
    options() {
      this.generate();
    },
  },
  created() {
    this.generate();
  },
  methods: {
    async generate() {
      this.loading = true;

      this.url = await new AwesomeQR({
        colorDark: '#6A6DCD',
        correctLevel: 2,
        logoImage: Logo,
        margin: 15, //px
        size: 500, // px
        text: this.text,
        whiteMargin: false,
        ...this.options,
      }).draw();

      this.loading = false;
    },
  },
};
</script>
