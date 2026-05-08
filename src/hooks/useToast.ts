import { toast } from 'react-toastify';

export const useToast = () => {
  return {
    showError: (message: string) => toast.error(message),
    showSuccess: (message: string) => toast.success(message),
    showWarning: (message: string) => toast.warning(message),
  };
};
