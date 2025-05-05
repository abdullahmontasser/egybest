import { motion, AnimatePresence } from 'framer-motion';
import '../css/Toast.css';
import { useNotification } from '../contexts/NotificationContext';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  return (
    <motion.div
      className={`toast ${type}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <span>{message}</span>
      <button onClick={onClose} className="close-button">
        ×
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
