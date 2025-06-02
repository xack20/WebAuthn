import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-4 border-blue-200 border-t-blue-600 mb-4`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.p
        className="text-gray-600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
