import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const ROUNDS = [
  { deg: 'N', sz: 2048 },
  { deg: 'N/2', sz: 1024 },
  { deg: 'N/4', sz: 512 },
  { deg: 'N/8', sz: 256 },
  { deg: 'const', sz: 1 },
];
const C = { bar: '#3b82f6', query: '#f59e0b', fold: '#10b981' };
const maxW = 280, BH = 22, GAP = 8, OX = 90, OY = 12;

const STEPS = [
  { label: 'Round 0: 원본 다항식 f(X), 도메인 N', body: '원본 다항식의 평가를 Merkle 트리로 커밋합니다.' },
  { label: 'Round 1: β₀으로 접기 → 차수 N/2', body: 'f_half(X) = (f(X)+f(-X))/2 + β·(f(X)-f(-X))/(2X). 도메인 절반.' },
  { label: 'Round 2-3: 반복 접기 → N/4, N/8', body: '매 라운드 Fiat-Shamir 도전값 β를 샘플링하여 차수를 절반씩 줄입니다.' },
  { label: '최종 상수 다항식 + 쿼리 단계', body: '차수 0 확인 후 num_queries개 인덱스로 모든 라운드 Merkle 개구 검증.' },
];

export default function FRIFoldingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fri-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.fold} opacity={0.6} />
            </marker>
          </defs>
          {ROUNDS.map((r, i) => {
            const show = step === 0 ? i === 0
              : step === 1 ? i <= 1
              : step === 2 ? i <= 3
              : true;
            const w = Math.max((r.sz / 2048) * maxW, 12);
            const y = OY + i * (BH + GAP);
            return (
              <motion.g key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: show ? 1 : 0.15, x: 0 }}
                transition={{ duration: 0.3, delay: show ? i * 0.08 : 0 }}>
                <text x={OX - 6} y={y + BH / 2 + 3} textAnchor="end"
                  fontSize={9} fill="var(--muted-foreground)">R{i}</text>
                <motion.rect x={OX} y={y} height={BH} rx={4}
                  fill={C.bar + '25'} stroke={C.bar} strokeWidth={show ? 1.5 : 0.5}
                  initial={{ width: 0 }} animate={{ width: w }}
                  transition={{ duration: 0.4, delay: i * 0.08 }} />
                <text x={OX + w + 6} y={y + BH / 2 + 3}
                  fontSize={9} fontWeight={600} fill={C.bar}>{r.deg}</text>
                {/* Fold arrows */}
                {show && i > 0 && step >= 1 && (
                  <motion.line
                    x1={OX + (ROUNDS[i - 1].sz / 2048) * maxW / 2} y1={y - GAP + 2}
                    x2={OX + w / 2} y2={y - 2}
                    stroke={C.fold} strokeWidth={1} strokeDasharray="3 2"
                    markerEnd="url(#fri-a)" opacity={0.5}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
                )}
              </motion.g>
            );
          })}
          {/* Query phase indicators */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2].map(q => {
                const x = OX + 40 + q * 70;
                return (
                  <g key={q}>
                    <line x1={x} y1={OY} x2={x} y2={OY + 4 * (BH + GAP) + BH}
                      stroke={C.query} strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
                    <circle cx={x} cy={OY - 6} r={5} fill={C.query + '30'} stroke={C.query} />
                    <text x={x} y={OY - 4} textAnchor="middle" fontSize={9} fill={C.query}>Q</text>
                  </g>
                );
              })}
              <text x={OX + 145} y={OY + 5 * (BH + GAP) + 8} textAnchor="middle"
                fontSize={9} fill={C.query}>쿼리 검증 단계</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
