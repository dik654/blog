import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { prop: '#6366f1', vote: '#f59e0b', pre: '#0ea5e9', ok: '#10b981' };
const I = { opacity: 0, y: 4 };
type R = [string, string, number][];

const STEPS = [
  { label: 'Propose — 블록 제안' },
  { label: 'Prevote — 유효성 투표' },
  { label: 'Precommit — Polka 기반 확정' },
  { label: 'Commit — 확정 후 Height+1' },
];

const DATA: { title: string; color: string; rows: R }[] = [
  { title: 'Phase 1: Propose (height=h, round=r)', color: C.prop, rows: [
    ['Proposer = validators[(h + r) mod n]', 'var(--foreground)', 0.15],
    ['Msg: ⟨PROPOSAL, h, r, block, pol_round⟩', 'var(--foreground)', 0.3],
    ['pol_round: 이전 Polka 라운드 (-1이면 없음)', 'var(--muted-foreground)', 0.45],
    ['timeout_propose 내 미도착 → Prevote(nil)', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'Phase 2: Prevote', color: C.vote, rows: [
    ['pᵢ: valid(block) → ⟨PREVOTE, h, r, H(block)⟩', 'var(--foreground)', 0.15],
    ['잠금 확인: lockedRound ≤ pol_round → 허용', 'var(--muted-foreground)', 0.3],
    ['+2/3 Prevote(id) 수신 = "Polka" 형성', C.vote, 0.45],
    ['+2/3 Prevote(nil) → Precommit(nil) 전송', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'Phase 3: Precommit (잠금 설정)', color: C.pre, rows: [
    ['Polka(B) 수신: lockedValue=B, lockedRound=r', 'var(--foreground)', 0.15],
    ['Msg: ⟨PRECOMMIT, h, r, H(B)⟩  broadcast', 'var(--foreground)', 0.3],
    ['+2/3 Precommit(id) → commit 진행', C.pre, 0.45],
    ['+2/3 미달 → timeout_precommit → round+1', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'Phase 4: Commit (즉시 최종성)', color: C.ok, rows: [
    ['+2/3 Precommit(H(B)) 수집 완료', 'var(--foreground)', 0.15],
    ["실행: apply(B) → state' = exec(state, B.txs)", C.ok, 0.3],
    ['State: height=h+1, round=0, lockedValue=nil', 'var(--foreground)', 0.45],
    ['PBFT와 달리 즉시 최종성 — 포크 불가', 'var(--muted-foreground)', 0.6],
  ]},
];

export default function ProtocolViz() {
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
