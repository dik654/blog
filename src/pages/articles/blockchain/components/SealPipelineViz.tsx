import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const PHASES = [
  { id: 'PC1', color: '#6366f1', time: '수 시간', res: 'CPU+RAM' },
  { id: 'PC2', color: '#0ea5e9', time: '~20분', res: 'GPU' },
  { id: 'C1', color: '#10b981', time: '수 분', res: 'CPU' },
  { id: 'C2', color: '#f59e0b', time: '수 분', res: 'GPU' },
];
const XS = [55, 135, 215, 295];
const BY = 50;

const STEPS = [
  { label: 'PC1 — SDR 레이블링', body: '11개 레이어 순차 SHA256 해시. 병렬화 불가. comm_d 생성.' },
  { label: 'PC2 — Merkle 트리 생성', body: 'GPU Poseidon 해시로 TreeR/TreeC 생성. comm_r, comm_c 출력.' },
  { label: 'C1 — 챌린지 샘플링', body: '체인 시드로 챌린지 인덱스 결정, Merkle 포함 증명 경로 생성.' },
  { label: 'C2 — Groth16 증명', body: '수억 게이트 SNARK 생성 (GPU 필수). 최종 증명 192 bytes.' },
];

export default function SealPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 360 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const active = i <= step;
            const cur = i === step;
            return (
              <g key={p.id}>
                <motion.rect x={XS[i] - 28} y={BY - 16} width={56} height={32} rx={6}
                  animate={{ fill: cur ? `${p.color}25` : active ? `${p.color}12` : `${p.color}06`,
                    stroke: p.color, strokeWidth: cur ? 2 : 0.8, opacity: active ? 1 : 0.25 }}
                  transition={sp} />
                <text x={XS[i]} y={BY - 2} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={p.color} opacity={active ? 1 : 0.3}>{p.id}</text>
                <text x={XS[i]} y={BY + 9} textAnchor="middle" fontSize={9}
                  fill={p.color} opacity={active ? 0.7 : 0.2}>{p.time}</text>
                <motion.text x={XS[i]} y={BY + 26} textAnchor="middle" fontSize={4.5}
                  fill="var(--muted-foreground)"
                  animate={{ opacity: cur ? 0.8 : 0.2 }} transition={sp}>{p.res}</motion.text>
                {i < PHASES.length - 1 && (
                  <motion.line x1={XS[i] + 30} y1={BY} x2={XS[i + 1] - 30} y2={BY}
                    stroke={p.color} strokeWidth={1} markerEnd="url(#sa)"
                    animate={{ opacity: active && step > i ? 0.6 : 0.12 }} transition={sp} />
                )}
              </g>
            );
          })}
          <defs>
            <marker id="sa" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={240} y={80} width={100} height={14} rx={4} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={290} y={90} textAnchor="middle" fontSize={5.5} fontWeight={600} fill="#f59e0b">Groth16 192 bytes</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
