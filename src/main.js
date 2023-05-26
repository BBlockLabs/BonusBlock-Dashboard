import { createApp } from "vue";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import moment from "moment";
import axios from "axios";
import VueAxios from "vue-axios";
import ElementPlus from "element-plus";

import store from "@/state/store";
import router from "./router/router-config";
import App from "@/App.vue";
import DebugWrapper from "@/components/DebugWrapper.vue";
import mq from "./common/mq";
import VueApexCharts from "vue3-apexcharts";

import "@/design/index.scss";

// ISO-8601, Europe
moment.updateLocale("en", {
  week: {
    dow: 1, // First day of week is Monday
    doy: 4, // First week of year must contain 4 January (7 + 1 - 4)
  },
});

const app = createApp({
  extends: App,
});

app.config.globalProperties.$moment = moment;
app.config.unwrapInjectedRef = true;

app.use(store);
app.use(VueAxios, { $http: axios });
app.use(router);
app.use(mq);
app.use(ElementPlus);
app.use(VueApexCharts);

// Add $id method for component specific unique ids
app.use((app) => {
  let uidCounter = 0;

  app.mixin({
    beforeCreate: function () {
      this.uidCounter = uidCounter.toString();

      uidCounter += 1;
    },
    methods: {
      /**
       * @param {String|Number} id
       * @return {String}
       */
      $id: function (id) {
        return "uid-" + this.uidCounter + (id ? "-" + id : "");
      },
    },
  });
});

app.mount("#app");
app.component("DebugWrapper", DebugWrapper);

// TODO: Leave only the used components
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

window.app = app;
BigInt.prototype.toJSON = function () {
  return this.toString();
};
