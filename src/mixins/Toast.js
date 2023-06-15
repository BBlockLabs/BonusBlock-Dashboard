import { ElMessage } from "element-plus";
import { h } from "vue";

export default {
  methods: {
    /**
     * @param {String} id
     * @return {void}
     */
    dismissToast(id) {
      const el = document.getElementById(id);
      if (!el) {
        return;
      }
      const closeBtn = el.parentElement.getElementsByClassName("el-message__closeBtn");
      if (!closeBtn || !closeBtn[0]) {
        return;
      }
      // @ts-ignore
      closeBtn[0].click();
    },
    /**
     * @param {String} title
     * @param {String} text
     * @param {'success'|'warning'|'error'|'info'} type
     * @param {Number} duration
     * @param {String} id
     * @return {void}
     */
    Toast(title, text, type = "info", duration = 0, id = "") {
      if (!text) {
        text = title;
        title = type === "info" || type === "success" ? "Information" : "Error";
      } else if (text instanceof Error) {
        text = text.message;
      }
      ElMessage({
        message: h(
          "div",
          {
            id: id,
            class: "toast-body",
          },
          [
            h("h6", null, title),
            h("div", null, text),
          ]
        ),
        type,
        duration,
        showClose: true,
        grouping: true,
      });
    },
    /**
     * @param {Error} error
     * @param {String|null} functionName
     * @return {void}
     */
    ToastError(error, functionName = null) {
      this.Toast(
        functionName
          ? "JavaScript error in " + functionName + "()"
          : "JavaScript error",
        error.message,
        "error",
        5000
      );
    },
  },
};
