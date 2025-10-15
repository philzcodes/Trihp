// Toast notification helper
import { Alert } from 'react-native';

export const showSucess = (message) => {
  Alert.alert('Success', message);
};

export const showSuccess = (message) => {
  Alert.alert('Success', message);
};

export const showError = (message) => {
  Alert.alert('Error', message);
};

export const showWarning = (message) => {
  Alert.alert('Warning', message);
};
