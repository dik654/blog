import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tokens = ['The', 'cat', 'sat', 'on', 'mat'];

const weights: Record<number, number[]> = {
  0: [0.1, 0.5, 0.1, 0.2, 0.1],
  1: [0.3, 0.1, 0.3, 0.1, 0.2],
  2: [0.1, 0.4, 0.1, 0.2, 0.2],
  3: [0.1, 0.1, 0.3, 0.1, 0.4],
  4: [0.2, 0.1, 0.2, 0.4, 0.1],
};

export default function AttentionDemo() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="rounded-lg border p-6">
      <p className="text-sm text-foreground/75 mb-4">
        토큰을 클릭하면 해당 토큰의 Attention 가중치를 확인할 수 있습니다.
      </p>
      <div className="flex justify-center gap-3 mb-6">
        {tokens.map((token, i) => (
          <motion.button
            key={token}
            onClick={() => setSelected(selected === i ? null : i)}
            className="relative rounded-lg border px-4 py-2 text-sm font-mono cursor-pointer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              backgroundColor:
                selected === i ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
              color: selected === i ? 'white' : 'oklch(0.205 0 0)',
            }}
          >
            {token}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center gap-3"
          >
            {tokens.map((token, i) => {
              const w = weights[selected][i];
              return (
                <div key={token} className="flex flex-col items-center gap-2">
                  <motion.div
                    className="rounded bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: w * 100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{ width: 40 }}
                  />
                  <span className="text-xs font-mono text-foreground/75">
                    {token}
                  </span>
                  <span className="text-xs font-medium">{w.toFixed(1)}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
