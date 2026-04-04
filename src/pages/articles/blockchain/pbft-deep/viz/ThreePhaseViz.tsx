import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { pp: '#6366f1', pr: '#0ea5e9', cm: '#10b981', rp: '#f59e0b' };
const I = { opacity: 0, y: 4 };
type R = [string, string, number][];

const STEPS = [
  { label: 'Client → Primary 요청' },
  { label: 'Pre-prepare: 순서 부여' },
  { label: 'Prepare: O(n²) 합의' },
  { label: 'Commit → Reply' },
];

const DATA: { title: string; color: string; rows: R }[] = [
  { title: 'Phase 0: Client Request', color: C.rp, rows: [
    ['Msg: ⟨REQUEST, op, timestamp, client_id⟩', 'var(--foreground)', 0.15],
    ['Client → Primary(p₀): unicast', 'var(--muted-foreground)', 0.3],
    ['Primary: p = v mod |R|  (v=view, R=레플리카)', 'var(--foreground)', 0.45],
    ['타임아웃 내 Reply 없으면 모든 레플리카에 전송', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'Phase 1: Pre-prepare', color: C.pp, rows: [
    ['Msg: ⟨PRE-PREPARE, v=3, n=142, d=H(m)⟩σ_p₀', 'var(--foreground)', 0.15],
    ['p₀ → {p₁,p₂,p₃}: broadcast', 'var(--muted-foreground)', 0.3],
    ['검증: in_view(v) ∧ no_dup(v,n) ∧ d==H(m)', 'var(--foreground)', 0.45],
    ['State: log[v=3][n=142] ← {m, pre-prepared}', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'Phase 2: Prepare (O(n²) 교환)', color: C.pr, rows: [
    ['pᵢ → all: ⟨PREPARE, v=3, n=142, d, i⟩σ_pᵢ', 'var(--foreground)', 0.15],
    ['대기: |{PREPARE(v,n,d) from distinct}| ≥ 2f', 'var(--muted-foreground)', 0.3],
    ['prepared(m,v,n) = PRE-PREPARE ∧ 2f PREPARE', C.pr, 0.45],
    ['State: log[v=3][n=142].prepared = true', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'Phase 3: Commit + Reply', color: C.cm, rows: [
    ['pᵢ → all: ⟨COMMIT, v=3, n=142, i⟩σ_pᵢ', 'var(--foreground)', 0.15],
    ['대기: |{COMMIT(v,n) from distinct}| ≥ 2f+1', 'var(--muted-foreground)', 0.3],
    ['committed(m,v,n) → execute(op) → result r', C.cm, 0.45],
    ['Reply: ⟨REPLY, v, t, client, i, r⟩ — f+1 동일=확정', 'var(--muted-foreground)', 0.6],
  ]},
];

export default function ThreePhaseViz() {
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
