import { motion } from "framer-motion";

const FloatingShapes = () => {
  const shapes = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="floating-shapes">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="shape"
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-100vh",
            opacity: [0, 1, 1, 0],
            rotate: 360,
            x: [0, 50, -50, 0],
          }}
          transition={{
            duration: 20 + index * 2,
            repeat: Infinity,
            delay: index * 2,
            ease: "linear",
          }}
          style={{
            left: `${10 + index * 12}%`,
            width: `${60 + index * 10}px`,
            height: `${60 + index * 10}px`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
