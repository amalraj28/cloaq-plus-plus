import { motion } from "framer-motion";

export const CloaQLogo = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Quantum Encryption "Q" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="text-6xl font-bold text-quantum glow-quantum-strong">
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

      {/* Arrow Animation */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center"
      >
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-3xl text-primary"
        >
          →
        </motion.div>
      </motion.div>

      {/* Classical Decryption "Cl" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
      >
        Cl
      </motion.div>

      {/* Full Name with fade-in */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-6xl font-bold bg-gradient-to-r from-primary via-quantum to-accent bg-clip-text text-transparent overflow-hidden"
      >
        oaQ
      </motion.div>
    </div>
  );
};
