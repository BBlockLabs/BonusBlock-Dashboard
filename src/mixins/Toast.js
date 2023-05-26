import {ElMessage} from "element-plus";
import {h} from "vue";

export default {
  methods: {
    /**
     * @param {String} title
     * @param {String} text
     * @param {'success'|'warning'|'error'|'info'} type
     * @param {Number} duration
     * @return {void}
     */
    Toast(title, text, type = "info", duration = 0) {
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
