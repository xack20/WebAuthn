import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const variants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-pink-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed top-4 right-4 z-50 ${getToastStyles()} text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20`}
        >
          <div className="flex items-center space-x-3">
            {getIcon()}
            <span className="font-medium">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
