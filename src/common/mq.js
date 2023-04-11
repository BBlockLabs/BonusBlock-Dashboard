import {reactive} from "vue";
export default {
  install: (app, options) => {
    let mq = reactive({});
    let update = () => {
      let win = window, doc = document, docElem = doc.documentElement, body = doc.getElementsByTagName('body')[0];
      let w = win.innerWidth || docElem.clientWidth || body.clientWidth;
      let h = win.innerHeight || docElem.clientHeight || body.clientHeight;
      mq.w = w;
      mq.h = h;
      // width breakpoints
      mq.xs = (w <= 400);
      mq.sm = (w <= 576);
      mq.md = (w <= 768);
      mq.lg = (w <= 992);
      mq.xl = (w <= 1200);
      // heights too
      mq.hxs = (h <= 400);
      mq.hsm = (h <= 576);
      // screen aspect ratio
      mq.ratio = w/h;
      mq.landscape = w > h;
      mq.portrait = !mq.landscape; // we decided to treat 1:1 aspect ratio as portrait
    };
    window.addEventListener('resize', update);
    update();
    app.config.globalProperties.$mq = mq;
    // uninstall
    const unmountApp = app.unmount;
    app.unmount = () => {
      window.removeEventListener('resize', update);
      unmountApp();
    };
  }
};
