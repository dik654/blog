import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const PHASES = [
  { id: 'Executor', color: '#6366f1', x: 45 },
  { id: 'Prover', color: '#10b981', x: 125 },
  { id: 'Receipt', color: '#f59e0b', x: 205 },
  { id: 'Verify', color: '#8b5cf6', x: 285 },
];
const BY = 48;

const STEPS = [
  { label: 'Executor — RISC-V ELF 실행', body: 'ExecutorEnv 구성 후 ELF 실행. 매 사이클 32개 레지스터 + 메모리 상태 기록.' },
  { label: 'Prover — 세그먼트별 STARK', body: 'SegmentProver가 각 세그먼트를 독립 증명. FRI로 다항식 커밋, 재귀 압축.' },
  { label: 'Receipt — Journal + Seal', body: 'Journal: env::commit()한 공개 출력. Seal: STARK 또는 Groth16 SNARK.' },
  { label: '온체인 검증 — Groth16 래핑', body: 'RiscZeroGroth16Verifier.sol로 검증. ~250k gas, ~256 bytes.' },
];

export default function RISC0ReceiptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rc" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {PHASES.map((p, i) => {
            const active = i <= step;
            const cur = i === step;
            return (
              <g key={p.id}>
                <motion.rect x={p.x - 30} y={BY - 16} width={60} height={32} rx={6}
                  animate={{ fill: cur ? `${p.color}25` : active ? `${p.color}12` : `${p.color}06`,
                    stroke: p.color, strokeWidth: cur ? 2 : 0.8, opacity: active ? 1 : 0.25 }}
                  transition={sp} />
                <text x={p.x} y={BY + 2} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={p.color} opacity={active ? 1 : 0.3}>{p.id}</text>
                {i < PHASES.length - 1 && (
                  <motion.line x1={p.x + 32} y1={BY} x2={PHASES[i + 1].x - 32} y2={BY}
                    stroke={p.color} strokeWidth={1} markerEnd="url(#rc)"
                    animate={{ opacity: active && step > i ? 0.6 : 0.12 }} transition={sp} />
                )}
              </g>
            );
          })}
          {/* detail labels */}
          {step === 0 && (
            <motion.text x={45} y={88} textAnchor="middle" fontSize={9} fill="#6366f1"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>ELF → Trace</motion.text>
          )}
          {step === 1 && (
            <motion.text x={125} y={88} textAnchor="middle" fontSize={9} fill="#10b981"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>FRI STARK</motion.text>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={sp}>
              <text x={185} y={88} fontSize={9} fill="#f59e0b">Journal</text>
              <text x={225} y={88} fontSize={9} fill="#f59e0b">+ Seal</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={240} y={80} width={86} height={14} rx={4} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
              <text x={283} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">~250k gas</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
