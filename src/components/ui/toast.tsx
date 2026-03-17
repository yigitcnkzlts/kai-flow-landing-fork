"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ToastProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  onClose: () => void;
}

export const Toast = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-500";
      case "warning":
        return "bg-yellow-600 border-yellow-500";
      case "error":
        return "bg-red-600 border-red-500";
      default:
        return "bg-blue-600 border-blue-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg border text-white shadow-lg backdrop-blur-sm ${getToastStyles()}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">🚀</div>
        <div>
          <p className="font-semibold">Coming Soon!</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white/70 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type?: "info" | "success" | "warning" | "error";
    }>
  >([]);

  const showToast = (
    message: string,
    type: "info" | "success" | "warning" | "error" = "info"
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: index * 80, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );

  return { showToast, ToastContainer };
};
