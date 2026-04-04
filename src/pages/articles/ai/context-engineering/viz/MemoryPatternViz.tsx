import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PATTERNS } from './MemoryPatternData';

const W = 440, H = 220;
const BAR_X = 50, BAR_W = 300, BAR_H = 24, GAP = 8;

export default function MemoryPatternViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* title */}
          <text x={W / 2} y={20} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">
            토큰 사용량 비교
          </text>

          {/* bars */}
          {PATTERNS.map((p, i) => {
            const y = 40 + i * (BAR_H + GAP);
            const active = step === i;
            const isHybrid = step === 4;
            const barFrac = p.tokens / 100;
            return (
              <motion.g key={p.label}
                animate={{ opacity: active || isHybrid ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}>
                {/* label */}
                <text x={BAR_X - 8} y={y + BAR_H / 2 + 4} textAnchor="end"
                  fontSize={9} fontWeight={600} fill={p.color}>{p.label}</text>
                {/* bg bar */}
                <rect x={BAR_X} y={y} width={BAR_W} height={BAR_H} rx={4}
                  fill="var(--muted)" opacity={0.15} />
                {/* filled bar */}
                <motion.rect x={BAR_X} y={y} height={BAR_H} rx={4}
                  fill={`${p.color}30`} stroke={p.color} strokeWidth={active ? 1.5 : 0.5}
                  initial={{ width: 0 }}
                  animate={{ width: barFrac * BAR_W }}
                  transition={{ duration: 0.5, delay: isHybrid ? i * 0.1 : 0 }} />
                {/* percentage */}
                <text x={BAR_X + barFrac * BAR_W + 8} y={y + BAR_H / 2 + 4}
                  fontSize={9} fill={p.color} fontWeight={600}>{p.tokens}%</text>
              </motion.g>
            );
          })}

          {/* hybrid indicator */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={BAR_X} y={175} width={BAR_W} height={28} rx={5}
                fill="#10b98115" stroke="#10b981" strokeWidth={1.5}
                strokeDasharray="4 3" />
              <text x={BAR_X + BAR_W / 2} y={193} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#10b981">
                하이브리드: 최근 전체 + 이전 요약 + 핵심 벡터
              </text>
            </motion.g>
          )}

          {/* active pattern highlight */}
          {step < 4 && (
            <motion.circle r={4}
              animate={{
                cx: BAR_X - 20,
                cy: 40 + step * (BAR_H + GAP) + BAR_H / 2,
              }}
              transition={{ type: 'spring', bounce: 0.3 }}
              fill={PATTERNS[step].color}
              style={{ filter: `drop-shadow(0 0 4px ${PATTERNS[step].color}88)` }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
