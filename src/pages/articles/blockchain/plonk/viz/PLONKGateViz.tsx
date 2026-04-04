import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const SELS = ['q_L', 'q_R', 'q_M', 'q_O', 'q_C'];
const GATES = [
  { name: '덧셈', eq: 'a + b = c', vals: [1, 1, 0, -1, 0], color: '#6366f1' },
  { name: '곱셈', eq: 'a · b = c', vals: [0, 0, 1, -1, 0], color: '#10b981' },
  { name: '상수', eq: 'a = k', vals: [1, 0, 0, 0, '-k'], color: '#f59e0b' },
  { name: '커스텀', eq: 'a+b+ab = c', vals: [1, 1, 1, -1, 0], color: '#8b5cf6' },
];
const CW = 30, CH = 18, OX = 80, OY = 8, GAP = 2;

const STEPS = [
  { label: '덧셈 게이트 — q_L·a + q_R·b + q_O·c = 0', body: 'q_L=1, q_R=1, q_O=-1. R1CS에서는 별도 제약 필요, PLONKish에서는 동일 게이트.' },
  { label: '곱셈 게이트 — q_M·a·b + q_O·c = 0', body: 'q_M=1, q_O=-1. 비선형항 a·b를 셀렉터 하나로 표현.' },
  { label: '상수 게이트 — q_L·a + q_C = 0', body: 'q_L=1, q_C=-k. 상수값 k를 와이어에 바인딩.' },
  { label: '커스텀 게이트 — 복합식 1개 제약', body: 'q_L=q_R=q_M=1, q_O=-1. R1CS는 ~2 제약이지만 PLONKish는 1개.' },
];

export default function PLONKGateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* selector header */}
          {SELS.map((s, i) => (
            <text key={s} x={OX + i * (CW + GAP) + CW / 2} y={OY + 6} textAnchor="middle"
              fontSize={9} fontWeight={600} fill="var(--muted-foreground)">{s}</text>
          ))}
          {/* gate rows */}
          {GATES.map((g, gi) => {
            const y = OY + 12 + gi * (CH + GAP);
            const active = step === gi;
            return (
              <g key={g.name}>
                {/* gate label */}
                <text x={OX - 6} y={y + 12} textAnchor="end" fontSize={9}
                  fontWeight={active ? 700 : 400} fill={g.color}>{g.name}</text>
                {/* selector cells */}
                {g.vals.map((v, vi) => (
                  <motion.g key={vi}>
                    <motion.rect x={OX + vi * (CW + GAP)} y={y} width={CW} height={CH} rx={2}
                      animate={{ fill: active ? `${g.color}25` : `${g.color}06`,
                        stroke: g.color, strokeWidth: active ? 1.5 : 0.3 }}
                      transition={sp} />
                    <text x={OX + vi * (CW + GAP) + CW / 2} y={y + 12} textAnchor="middle"
                      fontSize={9} fill={g.color} opacity={active ? 1 : 0.3}>
                      {String(v)}
                    </text>
                  </motion.g>
                ))}
                {/* equation */}
                <motion.text x={OX + 5 * (CW + GAP) + 8} y={y + 12} fontSize={9}
                  fill={g.color} animate={{ opacity: active ? 0.8 : 0.2 }} transition={sp}>
                  {g.eq}
                </motion.text>
              </g>
            );
          })}
          {/* formula header */}
          <text x={140} y={96} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">
            q_L·a + q_R·b + q_M·a·b + q_O·c + q_C = 0
          </text>
        </svg>
      )}
    </StepViz>
  );
}
