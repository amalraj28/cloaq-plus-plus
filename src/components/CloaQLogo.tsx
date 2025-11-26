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
    <div className="cloaq-logo-container">
      {/* Background text that stays visible during transition */}
      <motion.div
        animate={{ 
          opacity: stage === 0 ? 1 : stage === 1 ? 0.2 : 0,
          filter: stage === 1 ? "blur(2px)" : "blur(0px)"
        }}
        transition={{ duration: 1 }}
        className="cloaq-background-text"
      >
        <div className="cloaq-word-container">
          <span className="cloaq-word">
            <span style={{ color: 'transparent' }}>Q</span>
            uantum
          </span>
          <span className="cloaq-word">
            <span style={{ color: 'transparent' }}>O</span>
            bfuscation
          </span>
        </div>
        <div className="cloaq-word-container" style={{ marginTop: '0.5rem' }}>
          <span className="cloaq-word">
            <span style={{ color: 'transparent' }}>Cl</span>
            assical
          </span>
          <span className="cloaq-word">
            <span style={{ color: 'transparent' }}>A</span>
            mendment
          </span>
        </div>
      </motion.div>

      {/* Animated highlighted letters */}
      <div style={{ position: 'relative' }}>
        {stage === 0 && (
          <div className="cloaq-background-text">
            <div className="cloaq-word-container">
              <span className="cloaq-word">
                <motion.span
                  className="cloaq-highlight-q glow-quantum-strong"
                  style={{ display: 'inline-block' }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Q
                </motion.span>
                <span style={{ visibility: 'hidden' }}>uantum</span>
              </span>
              <span className="cloaq-word">
                <motion.span
                  className="cloaq-highlight-o"
                  style={{ display: 'inline-block' }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  O
                </motion.span>
                <span style={{ visibility: 'hidden' }}>bfuscation</span>
              </span>
            </div>
            <div className="cloaq-word-container" style={{ marginTop: '0.5rem' }}>
              <span className="cloaq-word">
                <motion.span
                  className="cloaq-highlight-cl"
                  style={{ display: 'inline-block' }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  Cl
                </motion.span>
                <span style={{ visibility: 'hidden' }}>assical</span>
              </span>
              <span className="cloaq-word">
                <motion.span
                  className="cloaq-highlight-a"
                  style={{ display: 'inline-block' }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  A
                </motion.span>
                <span style={{ visibility: 'hidden' }}>mendment</span>
              </span>
            </div>
          </div>
        )}

        {stage >= 1 && (
          <motion.div
            initial={false}
            className="cloaq-final-container"
          >
            {/* Classical "Cl" - moves from bottom right to CloaQ position */}
            <motion.div
              initial={stage === 1 ? { x: 0, y: 80 } : false}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="cloaq-letter cloaq-letter-cl"
            >
              Cl
            </motion.div>

            {/* Obfuscation "o" - moves from top right to CloaQ position */}
            <motion.div
              initial={stage === 1 ? { x: 120, y: -40 } : false}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.1 }}
              className="cloaq-letter cloaq-letter-o"
            >
              o
            </motion.div>

            {/* Amendment "a" - moves from bottom right to CloaQ position */}
            <motion.div
              initial={stage === 1 ? { x: 180, y: 80 } : false}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
              className="cloaq-letter cloaq-letter-a"
            >
              a
            </motion.div>

            {/* Quantum "Q" - moves from top left to CloaQ position */}
            <motion.div
              initial={stage === 1 ? { x: -180, y: -40 } : false}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
              className="cloaq-letter cloaq-letter-q"
            >
              Q
              <motion.div
                className="cloaq-pulse-dot"
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
