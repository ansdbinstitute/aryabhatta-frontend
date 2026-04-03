import useUIStore from '../stores/uiStore';

/**
 * Convenience hook for toast notifications
 */
const useToast = () => {
  const { addToast, success, error, warning, info } = useUIStore();
  return { addToast, success, error, warning, info };
};

export default useToast;
