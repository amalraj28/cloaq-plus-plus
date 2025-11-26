import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const CloaQLogo = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 3000);  // Show full phrase for 3s
      setTimeout(() => setStage(2), 6000);  // Fade background
      setTimeout(() => setStage(0), 9000);  // Wait 2s then restart
    };
    
    cycle();
    const interval = setInterval(cycle, 11000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[120px]">
      {/* Background text that stays visible during transition */}
      <motion.div
        animate={{ 
          opacity: stage === 0 ? 1 : stage === 1 ? 0.2 : 0,
          filter: stage === 1 ? "blur(2px)" : "blur(0px)"
        }}
        transition={{ duration: 1 }}
        className="absolute text-3xl md:text-4xl font-bold text-center space-y-2"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="text-foreground">
            <span className="text-transparent">Q</span>
            uantum
          </span>
          <span className="text-foreground">
            <span className="text-transparent">O</span>
            bfuscation
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="text-foreground">
            <span className="text-transparent">Cl</span>
            assical
          </span>
          <span className="text-foreground">
            <span className="text-transparent">A</span>
            mendment
          </span>
        </div>
      </motion.div>

      {/* Animated highlighted letters */}
      <div className="relative">
        {stage === 0 && (
          <div className="text-3xl md:text-4xl font-bold text-center space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-foreground">
                <motion.span
                  className="text-quantum glow-quantum-strong text-4xl md:text-5xl inline-block"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Q
                </motion.span>
                <span className="invisible">uantum</span>
              </span>
              <span className="text-foreground">
                <motion.span
                  className="text-accent text-4xl md:text-5xl inline-block"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  O
                </motion.span>
                <span className="invisible">bfuscation</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-foreground">
                <motion.span
                  className="text-primary text-4xl md:text-5xl inline-block"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  Cl
                </motion.span>
                <span className="invisible">assical</span>
              </span>
              <span className="text-foreground">
                <motion.span
                  className="text-primary text-4xl md:text-5xl inline-block"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  A
                </motion.span>
                <span className="invisible">mendment</span>
              </span>
            </div>
          </div>
        )}

        {stage >= 1 && (
          <motion.div
            initial={false}
            className="flex items-center justify-center gap-1"
          >
            {/* Classical "Cl" - moves from bottom right to CloaQ position */}
            <motion.div
              initial={stage === 1 ? { x: 0, y: 80 } : false}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-5xl md:text-6xl font-bold text-primary"
            >
              Cl
            </motion.div>

            {/* Obfuscation "o" - moves from top right to CloaQ position */}
            <motion.div
              initial={stage === 1 ? { x: 120, y: -40 } : false}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-accent"
            >
              o
            </motion.div>

            {/* Amendment "a" - moves from bottom right to CloaQ position */}
            <motion.div
              initial={stage === 1 ? { x: 180, y: 80 } : false}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-primary"
            >
              a
            </motion.div>

            {/* Quantum "Q" - moves from top left to CloaQ position */}
            <motion.div
              initial={stage === 1 ? { x: -180, y: -40 } : false}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
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
      </div>
    </div>
  );
};
