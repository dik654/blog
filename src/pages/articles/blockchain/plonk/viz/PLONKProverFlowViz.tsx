import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const ROWS = [
  { r: 'R1', title: 'Wire Commits', out: '[a],[b],[c]', color: '#6366f1' },
  { fs: 'β, γ' },
  { r: 'R2', title: 'Perm Accum', out: '[Z]₁', color: '#10b981' },
  { fs: 'α' },
  { r: 'R3', title: 'Quotient', out: '[t_lo,mid,hi]', color: '#f59e0b' },
  { fs: 'ζ' },
  { r: 'R4', title: 'Evaluations', out: '6 스칼라', color: '#8b5cf6' },
  { fs: 'ν' },
  { r: 'R5', title: 'Opening', out: '[Wζ],[Wζω]', color: '#ec4899' },
  { verify: true },
] as const;

const OX = 60, RW = 180, RH = 14, GAP = 1, OY = 2;
const roundIdx = [0, 2, 4, 6, 8];

const STEPS = [
  { label: 'Round 1 → Fiat-Shamir β,γ', body: 'Wire commits [a],[b],[c]를 KZG로 전송. transcript 해시로 β,γ 도출.' },
  { label: 'Round 2 → Fiat-Shamir α', body: 'Z(x) grand product로 copy constraint 검증. [Z]₁ 전송 후 α 도출.' },
  { label: 'Round 3 → Fiat-Shamir ζ', body: 't(x) = 모든 제약/Zₕ(x). 3개 청크 commit 후 ζ 도출.' },
  { label: 'Round 4 → Fiat-Shamir ν', body: 'ζ에서 6개 스칼라 평가값 전송. ν 도출.' },
  { label: 'Round 5 → Verifier', body: '배치 KZG opening으로 W_ζ, W_ζω 생성. 페어링 2회로 O(1) 검증.' },
];

export default function PLONKProverFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 450 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Prover / Verifier labels */}
          <text x={OX - 8} y={OY + 6} textAnchor="end" fontSize={9}
            fontWeight={600} fill="var(--muted-foreground)">Prover</text>
          <text x={OX + RW + 8} y={OY + 6} fontSize={9}
            fontWeight={600} fill="var(--muted-foreground)">Verifier</text>
          {ROWS.map((row, i) => {
            const y = OY + 10 + i * (RH + GAP);
            if ('fs' in row) {
              const prevRound = roundIdx.indexOf(i - 1);
              const active = step > prevRound;
              return (
                <motion.g key={i} animate={{ opacity: active ? 0.6 : 0.1 }} transition={sp}>
                  <line x1={OX + RW - 4} y1={y + RH / 2} x2={OX + 4} y2={y + RH / 2}
                    stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="2 2" />
                  <text x={OX + RW / 2} y={y + RH / 2 + 3} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">← {row.fs}</text>
                </motion.g>
              );
            }
            if ('verify' in row) {
              const active = step >= 4;
              return (
                <motion.g key={i} animate={{ opacity: active ? 1 : 0.1 }} transition={sp}>
                  <rect x={OX} y={y} width={RW} height={RH} rx={3}
                    fill={active ? '#ef444418' : '#ef444406'} stroke="#ef4444"
                    strokeWidth={active ? 1.2 : 0.3} />
                  <text x={OX + RW / 2} y={y + 10} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill="#ef4444">Verify — 페어링 2회 O(1)</text>
                </motion.g>
              );
            }
            const ri = roundIdx.indexOf(i);
            const active = step >= ri;
            const glow = step === ri;
            return (
              <g key={i}>
                <motion.rect x={OX} y={y} width={RW} height={RH} rx={3}
                  animate={{ fill: active ? `${row.color}18` : `${row.color}06`,
                    stroke: row.color!, strokeWidth: glow ? 1.8 : 0.4, opacity: active ? 1 : 0.15 }}
                  transition={sp} />
                <text x={OX + 6} y={y + 10} fontSize={9} fontWeight={600}
                  fill={row.color} opacity={active ? 1 : 0.2}>{row.r}</text>
                <text x={OX + 30} y={y + 10} fontSize={9}
                  fill={row.color} opacity={active ? 0.7 : 0.15}>{row.title}</text>
                <text x={OX + RW - 6} y={y + 10} textAnchor="end" fontSize={9}
                  fill={row.color} opacity={active ? 0.5 : 0.1}>{row.out}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
