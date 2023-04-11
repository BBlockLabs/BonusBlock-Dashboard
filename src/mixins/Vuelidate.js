import { useVuelidate } from "@vuelidate/core";

export default {
  data() {
    return {
      vuelidate: useVuelidate(),
    };
  },
  methods: {
    /**
     * @param {any} el
     * @return {string}
     */
    getVuelidateErrorMessage(el) {
      if (!el || !el.$dirty) {
        return "";
      }

      if (el.required && el.required.$invalid) {
        return "Required";
      }

      if (el.minLength && el.minLength.$invalid) {
        return `must be at least ${el.minLength.$params.min} characters long`;
      }

      if (el.maxLength && el.maxLength.$invalid) {
        return `must be no more than ${el.maxLength.$params.max} characters long`;
      }

      if (el.numeric && el.numeric.$invalid) {
        return `Must be a number`;
      }

      if (el.decimal && el.decimal.$invalid) {
        return `Must be a decimal number`;
      }

      return "";
    },
  },
  validations() {
    throw "validations method needs to be overwritten when using Vuelidate mixin";
  },
};
