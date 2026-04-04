import { useState } from 'react';
import { motion } from 'framer-motion';

const DATA = [12, 15, 13, 18, 20, 22, 19, 25, 28, 30, 27, 32];
const WIN = 4;

export default function WindowSliding() {
  const [pos, setPos] = useState(0);
  const maxPos = DATA.length - WIN - 1;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">
        윈도우 크기 = {WIN} — 입력 {WIN}개 → 다음 1개 예측
      </p>

      <div className="flex items-end gap-1 h-28 px-2">
        {DATA.map((v, i) => {
          const isInput = i >= pos && i < pos + WIN;
          const isTarget = i === pos + WIN;
          const color = isInput ? '#6366f1' : isTarget ? '#ef4444' : '#334155';
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                animate={{ height: v * 3, background: color + '80' }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-full rounded-t-sm"
                style={{ minHeight: 4 }}
              />
              <span className="text-[9px] font-mono"
                style={{ color: isInput ? '#6366f1' : isTarget ? '#ef4444' : '#64748b' }}>
                {v}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-indigo-500/80" /> 입력 (X)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-red-500/80" /> 타겟 (y)
          </span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setPos(Math.max(0, pos - 1))} disabled={pos === 0}
            className="px-3 py-1 text-xs rounded border disabled:opacity-30 hover:bg-accent cursor-pointer">←</button>
          <button onClick={() => setPos(Math.min(maxPos, pos + 1))} disabled={pos === maxPos}
            className="px-3 py-1 text-xs rounded border disabled:opacity-30 hover:bg-accent cursor-pointer">→</button>
        </div>
      </div>

      <p className="text-[11px] text-foreground/50 font-mono text-center">
        X = [{DATA.slice(pos, pos + WIN).join(', ')}] → y = {DATA[pos + WIN]}
      </p>
    </div>
  );
}
