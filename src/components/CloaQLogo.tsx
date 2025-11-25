import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const CloaQLogo = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 2000),  // Show full phrase
      setTimeout(() => setStage(2), 4000),  // Rearrange to CloaQ
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="full-phrase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            className="flex items-center justify-center gap-2"
          >
            {/* Quantum Encryption "Q" */}
            <motion.div
              initial={{ x: -100, y: -50 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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

            {/* Classical Decryption "Cl" */}
            <motion.div
              initial={{ x: 100, y: 50 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold text-primary"
            >
              Cl
            </motion.div>

            {/* Obfuscation "o" */}
            <motion.div
              initial={{ x: -50, y: 50 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-accent"
            >
              o
            </motion.div>

            {/* Amendment "a" */}
            <motion.div
              initial={{ x: 50, y: -50 }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-primary"
            >
              a
            </motion.div>

            {/* Final "Q" with special styling */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-quantum via-accent to-primary bg-clip-text text-transparent"
            >
              Q
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
