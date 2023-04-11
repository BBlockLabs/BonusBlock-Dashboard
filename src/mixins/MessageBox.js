import {ElMessageBox} from 'element-plus';

export default {
  methods: {
    /**
     * Wrapper for ElMessageBox.confirm
     *
     * ElMessageBox.confirm is wrapped since on cancel it throws an exception
     * and on confirm it returns a string
     *
     * @param {String} message
     * @param {Object} options
     * @return {Promise<boolean>}
     */
    async MessageBoxConfirm(message, options) {
      try {
        const confirm = await ElMessageBox.confirm(
          message,
          {
            center: true,
            showClose: false,
            cancelButtonText: 'Cancel',
            cancelButtonClass: 'is-plain',
            ...options,
          }
        );

        return confirm === 'confirm';
      } catch (e) {
        return false;
      }
    },
  },
};
