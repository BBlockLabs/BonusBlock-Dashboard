import { ElMessage } from 'element-plus';

export default {
  methods: {
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);

        ElMessage({
          message:'Text copied to clipboard',
          type: 'success',
          duration: 5000,
          showClose: true,
          grouping: true,
        });
      } catch {
        ElMessage({
          message:'Browser does not have permissions to copy text',
          type: 'warning',
          duration: 5000,
          showClose: true,
          grouping: true,
        });
      }
    },
  },
};
