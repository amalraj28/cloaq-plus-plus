import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const CloaQLogo = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 3000);  // Show full phrase for 3s
      setTimeout(() => setStage(2), 5500);  // Start transition to CloaQ
      setTimeout(() => setStage(0), 8500);  // Wait 2s then restart (8.5s total + 0.5s fade = 9s cycle)
    };
    
    cycle();
    const interval = setInterval(cycle, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[120px]">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="full-phrase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="text-3xl md:text-4xl font-bold text-center space-y-2"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-foreground">
                <motion.span
                  className="text-quantum glow-quantum-strong text-4xl md:text-5xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Q
                </motion.span>
                uantum
              </span>
              <span className="text-foreground">
                <motion.span
                  className="text-accent text-4xl md:text-5xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  O
                </motion.span>
                bfuscation
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-foreground">
                <motion.span
                  className="text-primary text-4xl md:text-5xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  Cl
                </motion.span>
                assical
              </span>
              <span className="text-foreground">
                <motion.span
                  className="text-primary text-4xl md:text-5xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  A
                </motion.span>
                mendment
              </span>
            </div>
          </motion.div>
        )}

        {stage >= 1 && (
          <motion.div
            key="cloaq"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="flex items-center justify-center gap-1"
          >
            {/* Classical "Cl" */}
            <motion.div
              initial={{ x: 100, y: 50 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-primary"
            >
              Cl
            </motion.div>

            {/* Obfuscation "o" */}
            <motion.div
              initial={{ x: -50, y: 50 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold text-accent"
            >
              o
            </motion.div>

            {/* Amendment "a" */}
            <motion.div
              initial={{ x: 50, y: -50 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-primary"
            >
              a
            </motion.div>

            {/* Quantum "Q" with glow effect */}
            <motion.div
              initial={{ opacity: 0, x: -100, y: -50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              <div className="text-5xl md:text-6xl font-bold text-quantum glow-quantum-strong">
                Q
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-quantum rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
