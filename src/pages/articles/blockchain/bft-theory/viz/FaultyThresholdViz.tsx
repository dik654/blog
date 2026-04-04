import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { ok: '#10b981', byz: '#ef4444', warn: '#f59e0b' };
const I = { opacity: 0, y: 4 };
type R = [string, string, number][];

const STEPS = [
  { label: 'n=3f 가정 (f=1, n=3)' },
  { label: '배신자가 이중 전송' },
  { label: 'Safety 위반 — 합의 실패' },
  { label: 'n=3f+1로 해결 (f=1, n=4)' },
];

const DATA: { title: string; color: string; rows: R }[] = [
  { title: 'Setup: n=3, f=1', color: C.warn, rows: [
    ['그룹: A(정직), B(정직), C(배신)  — 각 1명', 'var(--foreground)', 0.15],
    ['정족수: ⌈(n+f+1)/2⌉ = 3  → 전원 동의 필요', 'var(--muted-foreground)', 0.3],
    ['배신자 1명이 합의를 완전히 조작 가능', C.byz, 0.45],
  ]},
  { title: 'Attack: Equivocation', color: C.byz, rows: [
    ['C→A: send(⟨VOTE, value=v⟩)', 'var(--foreground)', 0.15],
    ["C→B: send(⟨VOTE, value=v'⟩)  ← 다른 값!", C.byz, 0.3],
    ["A.view={v from C}, B.view={v' from C}", 'var(--muted-foreground)', 0.45],
    ['A와 B는 서로의 수신 내용을 검증할 수 없음', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'Result: Safety Violation', color: C.byz, rows: [
    ['A: decide(v)  ← A 자신+C가 v 동의', C.byz, 0.15],
    ["B: decide(v') ← B 자신+C가 v' 동의", C.byz, 0.3],
    ["v ≠ v' → Agreement 속성 위반!", C.byz, 0.45],
    ['정직 노드끼리 서로 다른 값 확정 = 치명적 오류', 'var(--muted-foreground)', 0.6],
  ]},
  { title: 'Fix: n=3f+1 (n=4, f=1)', color: C.ok, rows: [
    ['정직: {N₁, N₂, N₃}=3명,  배신: {F}=1명', 'var(--foreground)', 0.15],
    ['정족수: 2f+1=3명 동의 필요', C.ok, 0.3],
    ['정직 3명이 동일 값 → 배신자 무력화', 'var(--foreground)', 0.45],
    ['두 정족수 교집합 ≥ f+1 → 반드시 정직 노드 포함', 'var(--muted-foreground)', 0.6],
  ]},
];

export default function FaultyThresholdViz() {
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
