import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C0, C2, CB, STEPS, LEVELS, BLOOM_BITS, L0_RANGES } from './ReadFlowData';

export default function ReadFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rfArr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" /></marker>
          </defs>
          {LEVELS.map((lv, i) => {
            const active = step >= i && step < 4;
            const hit = step === 3 && i === 4;
            const missed = step >= i + 1 || (step === 4 && i < 4);
            return (
              <motion.g key={i} animate={{ opacity: (active || hit || step === 4) ? 1 : missed ? 0.4 : 0.2 }}>
                <rect x={lv.x} y={50} width={80} height={55} rx={6}
                  fill={hit ? `${C2}20` : `${lv.c}08`}
                  stroke={lv.c} strokeWidth={(active && step === i) ? 1.5 : 0.7} />
                <text x={lv.x + 40} y={72} textAnchor="middle" fontSize={11} fontWeight={600} fill={lv.c}>{lv.label}</text>
                {missed && step < 4 && i < step && (
                  <g>
                    <rect x={lv.x + 20} y={85} width={40} height={16} rx={3} fill="#ef444420" stroke="#ef4444" strokeWidth={0.6} />
                    <text x={lv.x + 40} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">MISS</text>
                  </g>
                )}
                {hit && (
                  <g>
                    <rect x={lv.x + 20} y={85} width={40} height={16} rx={3} fill="#10b98120" stroke="#10b981" strokeWidth={0.6} />
                    <text x={lv.x + 40} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">HIT</text>
                  </g>
                )}
                {i < 4 && (
                  <line x1={lv.x + 80} y1={77} x2={lv.x + 100} y2={77}
                    stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#rfArr)" />
                )}
              </motion.g>
            );
          })}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={270} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">L0 키 범위 겹침:</text>
              {L0_RANGES.map((r, i) => (
                <g key={i}>
                  <rect x={230} y={r.y - 10} width={40 + i * 15} height={14} rx={3} fill={`${C0}${15 + i * 5}`} stroke={C0} strokeWidth={0.5} />
                  <text x={250 + (40 + i * 15) / 2} y={r.y + 1} textAnchor="middle" fontSize={9} fill={C0}>{r.a}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={140} y={130} width={260} height={65} rx={6} fill={`${CB}08`} stroke={CB} strokeWidth={1} />
              <text x={270} y={148} textAnchor="middle" fontSize={11} fontWeight={600} fill={CB}>Bloom Filter</text>
              {BLOOM_BITS.map((b, i) => (
                <g key={i}>
                  <rect x={155 + i * 20} y={158} width={16} height={16} rx={2}
                    fill={b === '1' ? `${CB}25` : 'var(--card)'} stroke={CB} strokeWidth={0.5} />
                  <text x={163 + i * 20} y={170} textAnchor="middle" fontSize={9} fill={b === '1' ? CB : 'var(--muted-foreground)'}>{b}</text>
                </g>
              ))}
              <text x={270} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                0 = 확실히 없음 | 1 = 있을 수도 (false positive 가능)
              </text>
            </motion.g>
          )}
          <text x={20} y={80} textAnchor="start" fontSize={10} fontWeight={600} fill="var(--foreground)">Get(k)</text>
        </svg>
      )}
    </StepViz>
  );
}
