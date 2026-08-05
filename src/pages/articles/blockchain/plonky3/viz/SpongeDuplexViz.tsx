import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.55 };

const RATE = '#6366f1';
const CAP = '#64748b';
const ABSORB = '#10b981';
const SAMPLE = '#f59e0b';
const SECURITY = '#ef4444';

const STEPS = [
  {
    label: '① 초기 상태',
    body: 'width=16 sponge state. rate(8)는 흡수/추출 영역, capacity(8)는 보안 마진. 모두 0으로 초기화.',
  },
  {
    label: '② observe(C1) → permutation',
    body: 'commitment_C1 8개 원소를 rate 부분에 add → Poseidon2 permutation 1회 적용. capacity는 외부 노출 없이 섞임.',
  },
  {
    label: '③ sample α',
    body: 'rate 부분에서 challenge α 추출. 추가 absorb 없이 가능, 필요 시 다시 permutation.',
  },
  {
    label: '④ observe(C2) → permutation',
    body: 'commitment_C2 흡수 후 permutation. transcript 누적으로 prover/verifier 동기화.',
  },
  {
    label: '⑤ sample β',
    body: '두 번째 challenge β 추출. observe→sample 듀플렉싱이 transcript hash 역할.',
  },
  {
    label: '⑥ Security 분석',
    body: 'capacity 8 × 31 bit (BabyBear) = 248 bit → classical 124 bit security. 표준 128 bit 목표에 근접.',
  },
];

const W = 16;
const RATE_N = 8;
const CELL_W = 22;
const CELL_H = 26;
const X0 = 60;
const Y0 = 38;

type CellState = 'zero' | 'absorb' | 'permuted' | 'sampled';

function stateAt(step: number): { rate: CellState[]; cap: CellState[]; label: string; out?: string } {
  const rate: CellState[] = Array(RATE_N).fill('zero');
  const cap: CellState[] = Array(W - RATE_N).fill('zero');
  if (step === 0) {
    return { rate, cap, label: 'state = [0; 16]' };
  }
  if (step === 1) {
    return {
      rate: Array(RATE_N).fill('permuted'),
      cap: Array(W - RATE_N).fill('permuted'),
      label: 'absorb(C1) → Permutation(state)',
    };
  }
  if (step === 2) {
    return {
      rate: Array(RATE_N).fill('sampled'),
      cap: Array(W - RATE_N).fill('permuted'),
      label: 'α = state[0..r]',
      out: 'α',
    };
  }
  if (step === 3) {
    return {
      rate: Array(RATE_N).fill('permuted'),
      cap: Array(W - RATE_N).fill('permuted'),
      label: 'absorb(C2) → Permutation(state)',
    };
  }
  if (step === 4) {
    return {
      rate: Array(RATE_N).fill('sampled'),
      cap: Array(W - RATE_N).fill('permuted'),
      label: 'β = state[0..r]',
      out: 'β',
    };
  }
  return {
    rate: Array(RATE_N).fill('permuted'),
    cap: Array(W - RATE_N).fill('permuted'),
    label: '128-bit 목표 ≈ 248-bit capacity / 2',
  };
}

function cellFill(s: CellState, isCap: boolean): string {
  if (s === 'absorb') return `${ABSORB}30`;
  if (s === 'permuted') return isCap ? `${CAP}25` : `${RATE}28`;
  if (s === 'sampled') return `${SAMPLE}30`;
  return isCap ? `${CAP}10` : `${RATE}10`;
}

function cellStroke(s: CellState, isCap: boolean): string {
  if (s === 'absorb') return ABSORB;
  if (s === 'sampled') return SAMPLE;
  return isCap ? CAP : RATE;
}

export default function SpongeDuplexViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const st = stateAt(step);
        const showPerm = step === 1 || step === 3;
        const showAbsorbArrow = step === 1 || step === 3;
        const showSampleArrow = step === 2 || step === 4;
        const showSecurity = step === 5;
        const absorbLabel = step === 1 ? 'C1' : step === 3 ? 'C2' : '';

        return (
          <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* region labels */}
            <text x={X0 + (RATE_N * CELL_W) / 2} y={26} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={RATE}>rate r=8</text>
            <text x={X0 + RATE_N * CELL_W + ((W - RATE_N) * CELL_W) / 2} y={26}
              textAnchor="middle" fontSize={9} fontWeight={600} fill={CAP}>capacity c=8</text>

            {/* dividing line */}
            <motion.line
              x1={X0 + RATE_N * CELL_W} y1={Y0 - 4}
              x2={X0 + RATE_N * CELL_W} y2={Y0 + CELL_H + 4}
              stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="2 2"
              animate={{ opacity: showSecurity ? 1 : 0.4 }} transition={sp} />

            {/* cells */}
            {Array.from({ length: W }).map((_, i) => {
              const isCap = i >= RATE_N;
              const s = isCap ? st.cap[i - RATE_N] : st.rate[i];
              const x = X0 + i * CELL_W;
              return (
                <g key={i}>
                  <motion.rect
                    x={x + 1} y={Y0} width={CELL_W - 2} height={CELL_H} rx={3}
                    animate={{
                      fill: cellFill(s, isCap),
                      stroke: cellStroke(s, isCap),
                      strokeWidth: s === 'zero' ? 0.5 : 1.3,
                      rotate: showPerm ? [0, -6, 6, 0] : 0,
                    }}
                    transition={{
                      ...sp,
                      rotate: { duration: 0.6, repeat: showPerm ? 1 : 0 },
                    }} />
                  <motion.text
                    x={x + CELL_W / 2} y={Y0 + CELL_H / 2 + 3}
                    textAnchor="middle" fontSize={8} fontWeight={600}
                    animate={{
                      fill: cellStroke(s, isCap),
                      opacity: s === 'zero' ? 0.4 : 1,
                    }} transition={sp}>
                    {s === 'zero' ? '0' : isCap ? `c${i - RATE_N}` : `r${i}`}
                  </motion.text>
                </g>
              );
            })}

            {/* state index labels */}
            <text x={X0 - 8} y={Y0 + CELL_H / 2 + 3} textAnchor="end"
              fontSize={8} fill="#64748b">state</text>
            <text x={X0 + W * CELL_W + 6} y={Y0 + CELL_H / 2 + 3}
              fontSize={8} fill="#64748b">[16]</text>

            {/* absorb arrow (top) */}
            {showAbsorbArrow && (
              <g>
                <motion.path
                  d={`M ${X0 + (RATE_N * CELL_W) / 2} 78 L ${X0 + (RATE_N * CELL_W) / 2} 92`}
                  stroke={ABSORB} strokeWidth={1.4} fill="none" markerEnd="url(#arrowAbsorb)"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }} transition={sp} />
                <motion.text
                  x={X0 + (RATE_N * CELL_W) / 2 + 8} y={86} fontSize={9} fontWeight={600}
                  fill={ABSORB} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  absorb({absorbLabel})
                </motion.text>
              </g>
            )}

            {/* sample arrow (top, going up) */}
            {showSampleArrow && (
              <g>
                <motion.path
                  d={`M ${X0 + (RATE_N * CELL_W) / 2} ${Y0 - 4} L ${X0 + (RATE_N * CELL_W) / 2} ${Y0 - 18}`}
                  stroke={SAMPLE} strokeWidth={1.4} fill="none" markerEnd="url(#arrowSample)"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }} transition={sp} />
                <motion.text
                  x={X0 + (RATE_N * CELL_W) / 2 + 10} y={Y0 - 6} fontSize={10} fontWeight={700}
                  fill={SAMPLE} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {st.out ?? ''}
                </motion.text>
              </g>
            )}

            {/* permutation badge */}
            {showPerm && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={X0 + W * CELL_W + 22} y={Y0 + 2} width={70} height={CELL_H - 4} rx={4}
                  fill={`${RATE}15`} stroke={RATE} strokeWidth={1} />
                <text x={X0 + W * CELL_W + 57} y={Y0 + CELL_H / 2 + 3}
                  textAnchor="middle" fontSize={8} fontWeight={600} fill={RATE}>
                  Poseidon2 π
                </text>
              </motion.g>
            )}

            {/* security overlay */}
            {showSecurity && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect
                  x={X0 + RATE_N * CELL_W - 1} y={Y0 - 6}
                  width={(W - RATE_N) * CELL_W + 2} height={CELL_H + 12}
                  rx={4} fill="none" stroke={SECURITY} strokeWidth={1.4}
                  strokeDasharray="3 2" />
                <text
                  x={X0 + RATE_N * CELL_W + ((W - RATE_N) * CELL_W) / 2}
                  y={Y0 + CELL_H + 18}
                  textAnchor="middle" fontSize={9} fontWeight={700} fill={SECURITY}>
                  c × 31 bit = 248 bit → ~124 bit security
                </text>
              </motion.g>
            )}

            {/* status label */}
            <motion.text
              x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="#475569" key={`lbl-${step}`}
              initial={{ opacity: 0, y: 134 }} animate={{ opacity: 1, y: 130 }}
              transition={sp}>
              {st.label}
            </motion.text>

            {/* legend */}
            <g>
              <rect x={60} y={148} width={10} height={8} fill={`${RATE}25`} stroke={RATE} strokeWidth={0.8} rx={2} />
              <text x={74} y={155} fontSize={8} fill={RATE} fontWeight={600}>rate</text>
              <rect x={108} y={148} width={10} height={8} fill={`${CAP}25`} stroke={CAP} strokeWidth={0.8} rx={2} />
              <text x={122} y={155} fontSize={8} fill={CAP} fontWeight={600}>capacity</text>
              <rect x={170} y={148} width={10} height={8} fill={`${ABSORB}30`} stroke={ABSORB} strokeWidth={0.8} rx={2} />
              <text x={184} y={155} fontSize={8} fill={ABSORB} fontWeight={600}>absorb</text>
              <rect x={228} y={148} width={10} height={8} fill={`${SAMPLE}30`} stroke={SAMPLE} strokeWidth={0.8} rx={2} />
              <text x={242} y={155} fontSize={8} fill={SAMPLE} fontWeight={600}>sample</text>
              <rect x={288} y={148} width={10} height={8} fill="none" stroke={SECURITY} strokeWidth={0.8} strokeDasharray="2 2" rx={2} />
              <text x={302} y={155} fontSize={8} fill={SECURITY} fontWeight={600}>security</text>
            </g>

            <defs>
              <marker id="arrowAbsorb" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={ABSORB} />
              </marker>
              <marker id="arrowSample" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={SAMPLE} />
              </marker>
            </defs>
          </svg>
        );
      }}
    </StepViz>
  );
}
