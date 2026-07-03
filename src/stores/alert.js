import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAlertStore = defineStore('alert', () => {
  const visible = ref(false);
  const title = ref('');
  const message = ref('');
  const variant = ref('info'); // info | warning | danger | success
  const confirmLabel = ref('OK');
  const cancelLabel = ref(''); // if empty, acts as single button alert modal
  const resolvePromise = ref(null);

  const show = (options = {}) => {
    title.value = options.title || 'Notification';
    message.value = options.message || '';
    variant.value = options.variant || 'info';
    confirmLabel.value = options.confirmLabel || 'OK';
    cancelLabel.value = options.cancelLabel || '';
    visible.value = true;

    return new Promise((resolve) => {
      resolvePromise.value = resolve;
    });
  };

  const showAlert = (msg, t = 'Notification') => {
    return show({
      title: t,
      message: msg,
      variant: 'info',
      confirmLabel: 'OK',
      cancelLabel: ''
    });
  };

  const showError = (msg, t = 'Error') => {
    return show({
      title: t,
      message: msg,
      variant: 'danger',
      confirmLabel: 'OK',
      cancelLabel: ''
    });
  };

  const showSuccess = (msg, t = 'Success') => {
    return show({
      title: t,
      message: msg,
      variant: 'success',
      confirmLabel: 'OK',
      cancelLabel: ''
    });
  };

  const showConfirm = (msg, t = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', vKey = 'danger') => {
    return show({
      title: t,
      message: msg,
      variant: vKey,
      confirmLabel: confirmText,
      cancelLabel: cancelText
    });
  };

  const confirm = () => {
    visible.value = false;
    if (resolvePromise.value) {
      resolvePromise.value(true);
      resolvePromise.value = null;
    }
  };

  const cancel = () => {
    visible.value = false;
    if (resolvePromise.value) {
      resolvePromise.value(false);
      resolvePromise.value = null;
    }
  };

  return {
    visible,
    title,
    message,
    variant,
    confirmLabel,
    cancelLabel,
    show,
    showAlert,
    showError,
    showSuccess,
    showConfirm,
    confirm,
    cancel
  };
});
