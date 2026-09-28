"use client";

import { motion } from "motion/react";

/** Page transition: each navigation fades and rises the new page in. Respects reduced motion via MotionConfig. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
