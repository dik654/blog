import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { p: '#6366f1', pc: '#10b981', cm: '#f59e0b', d: '#8b5cf6' };
const I = { opacity: 0, y: 4 };
type R = [string, string, number][];

const STEPS = [
  { label: 'View 1: B₁ Prepare QC' },
  { label: 'View 2: B₁ Pre-Commit + B₂ Prepare' },
  { label: 'View 3: B₁ Commit (3-chain)' },
  { label: 'View 4: B₁ Decide 확정' },
];

const DATA: { title: string; color: string; rows: R }[] = [
  { title: 'View 1: Prepare Phase for B₁', color: C.p, rows: [
    ['L₁→all: ⟨PROPOSE, view=1, B₁, highQC=genesis⟩', 'var(--foreground)', 0.15],
    ['pᵢ→L₁: ⟨VOTE, view=1, H(B₁)⟩σᵢ  (n-f 수집)', 'var(--foreground)', 0.3],
    ['prepareQC₁ = aggregate(n-f votes for B₁)', C.p, 0.45],
    ['B₁ 상태: 1-chain (Prepare만 완료)', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'View 2: B₁ Pre-Commit + B₂ Prepare', color: C.pc, rows: [
    ['L₂→all: ⟨PROPOSE, view=2, B₂, highQC=QC₁⟩', 'var(--foreground)', 0.15],
    ['B₂ Prepare 투표 = B₁ Pre-Commit (파이프라인)', 'var(--muted-foreground)', 0.3],
    ['B₁: 2-chain, B₂: 1-chain', C.pc, 0.45],
    ['핵심: view마다 1회 투표로 여러 블록 동시 진행', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'View 3: B₁ Commit (3-chain 완성)', color: C.cm, rows: [
    ['L₃→all: ⟨PROPOSE, view=3, B₃, highQC=QC₂⟩', 'var(--foreground)', 0.15],
    ['B₃ vote → QC₃ → B₁: 3-chain 형성', 'var(--foreground)', 0.3],
    ['3-chain: B₁←QC₁←B₂←QC₂←B₃←QC₃', C.cm, 0.45],
    ['B₁ locked — 다른 포크로 전환 불가', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'View 4: B₁ Decide 확정', color: C.d, rows: [
    ['QC₃ 확인 → B₁: committed-directly', 'var(--foreground)', 0.15],
    ['execute(B₁) → output(result) → 클라이언트 응답', C.d, 0.3],
    ['정상 상태: 매 view마다 1블록 확정 (파이프라인)', 'var(--foreground)', 0.45],
    ['통신: 리더 1회 브로드캐스트+응답 = O(n)/view', 'var(--muted-foreground)', 0.6],
  ]},
];

export default function ChainedVotingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const d = DATA[step];
        return (
          <svg viewBox="0 0 480 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={d.color}
              initial={I} animate={{ opacity: 1, y: 0 }}>{d.title}</motion.text>
            {d.rows.map(([txt, fill, delay], i) => (
              <motion.text key={i} x={15} y={38 + i * 20} fontSize={10} fill={fill}
                initial={I} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>{txt}</motion.text>
            ))}
          </svg>
        );
      }}
    </StepViz>
  );
}
