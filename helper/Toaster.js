// Toast notification helper
import { showToast } from '../components/Toast';

export const showSucess = (message) => {
  showToast(message, 'success');
};

export const showSuccess = (message) => {
  showToast(message, 'success');
};

export const showError = (message) => {
  showToast(message, 'error');
};

export const showWarning = (message) => {
  showToast(message, 'warning');
};
