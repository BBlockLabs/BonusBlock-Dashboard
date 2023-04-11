import {createApp} from 'vue';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/theme-chalk/base.css';
import 'element-plus/theme-chalk/display.css';
import '@/design/index.scss';
import 'default-passive-events';

import moment from 'moment';
import axios from 'axios';
import VueAxios from 'vue-axios';

import store from '@/state/store';
import router from './router/router-config';
import App from '@/App';
import Debug from '@/components/Debug';
import mq from './common/mq';

const app = createApp({
  extends: App,
});

app.config.globalProperties.$moment = moment;
app.config.unwrapInjectedRef = true;

app.use(store);
app.use(VueAxios, {$http: axios});
app.use(router);
app.use(mq);

// Add $id method for component specific unique ids
app.use((app) => {
  let uidCounter = 0;

  app.mixin({
    beforeCreate: function() {
      this.uidCounter = uidCounter.toString();

      uidCounter += 1;
    },
    methods: {
      /**
       * @param {String|Number} id
       * @return {String}
       */
      $id: function(id) {
        return 'uid-' + this.uidCounter + (id ? '-' + id : '');
      },
    },
  });
});

app.mount('#app');
app.component('Debug', Debug);

// TODO: Leave only the used components
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

window.app = app;
