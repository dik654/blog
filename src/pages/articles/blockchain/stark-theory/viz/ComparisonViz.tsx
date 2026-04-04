import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const COLS = [
  { label: 'Groth16', color: C1 },
  { label: 'PLONK', color: C2 },
  { label: 'STARK', color: C3 },
];
const ROWS = [
  { key: '셋업', vals: ['Trusted (회로별)', 'Trusted (범용)', 'Transparent'] },
  { key: 'Proof', vals: ['~200 B', '~400 B', '~100 KB'] },
  { key: '검증', vals: ['O(1) 페어링', 'O(1) 페어링', 'O(log² n) 해시'] },
  { key: '양자 내성', vals: ['✗', '✗', '✓'] },
  { key: '가정', vals: ['타원곡선', '타원곡선', '해시 함수'] },
];

const STEPS = [
  { label: 'SNARK vs STARK 비교', body: 'proof 크기 vs 신뢰 가정 — 핵심 트레이드오프.' },
  { label: '셋업 방식', body: 'SNARK은 trusted setup 필요. STARK은 공개 랜덤니스만 사용(투명).' },
  { label: 'Proof 크기 & 검증', body: 'SNARK은 O(1) 증명/검증. STARK은 로그 크기지만 해시만으로 검증.' },
  { label: '양자 내성', body: 'SNARK은 타원곡선 기반(양자 취약). STARK은 해시 기반(양자 안전).' },
];

const CW = 76, RW = 50, RH = 16, X0 = 30, Y0 = 8;

export default function ComparisonViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Column headers */}
          {COLS.map((c, i) => (
            <text key={c.label} x={X0 + RW + i * CW + CW / 2} y={Y0 + 10}
              textAnchor="middle" fontSize={9} fontWeight={600} fill={c.color}>{c.label}</text>
          ))}
          <line x1={X0} y1={Y0 + 14} x2={X0 + RW + 3 * CW} y2={Y0 + 14}
            stroke="var(--border)" strokeWidth={0.5} />

          {/* Rows */}
          {ROWS.map((row, ri) => {
            const highlight = (step === 1 && ri === 0) || (step === 2 && (ri === 1 || ri === 2))
              || (step === 3 && (ri === 3 || ri === 4));
            return (
              <motion.g key={row.key} animate={{ opacity: step === 0 || highlight ? 1 : 0.3 }}>
                <text x={X0} y={Y0 + 30 + ri * RH} fontSize={9} fontWeight={500}
                  fill="var(--muted-foreground)">{row.key}</text>
                {row.vals.map((v, ci) => (
                  <text key={ci} x={X0 + RW + ci * CW + CW / 2} y={Y0 + 30 + ri * RH}
                    textAnchor="middle" fontSize={9} fill={COLS[ci].color}>{v}</text>
                ))}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
