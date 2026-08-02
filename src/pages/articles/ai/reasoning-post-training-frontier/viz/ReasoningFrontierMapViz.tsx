import { motion, useReducedMotion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const steps = [
  { label: '1. Training compute와 test-time compute를 다른 장부에 적는다.', body: 'RL rollout·update 비용과 한 요청에서 쓰는 CoT·candidate search 비용은 서로 대체 가능한 한 숫자가 아니다.' },
  { label: '2. 최종 reward를 어느 reasoning step에 배분할지 정한다.', body: 'Outcome verifier는 trajectory 실패를 알리지만 최초 오류 위치는 알려 주지 않는다.' },
  { label: '3. Reward와 함께 policy entropy가 무너지지 않는지 본다.', body: 'Pass@1이 오르더라도 다른 성공 경로가 sampling되지 않으면 추가 RL의 학습 신호가 고갈될 수 있다.' },
  { label: '4. 추가 reasoning token이 정확도보다 비용만 늘리는 구간을 찾는다.', body: '문제 난이도에 맞춘 stopping과 candidate budget이 없으면 overthinking과 correlated search가 늘어난다.' },
  { label: '5. 정답, hidden test, visible CoT의 증거를 분리한다.', body: 'Checker 통과는 reward hacking을 줄일 수 있지만 visible reasoning의 인과적 충실성까지 증명하지 않는다.' },
];

const nodes = [
  { label: '계산 장부', sub: 'train ≠ test', color: '#2563eb', kind: 'data' },
  { label: 'Credit', sub: '어느 step?', color: '#7c3aed', kind: 'action' },
  { label: 'Entropy', sub: '탐색 유지?', color: '#d97706', kind: 'status' },
  { label: 'Overthinking', sub: '추가 token', color: '#dc2626', kind: 'alert' },
  { label: 'Monitor', sub: '증거 분리', color: '#059669', kind: 'module' },
] as const;

type Node = (typeof nodes)[number];

function SemanticNode({ node, x, y, w = 118, h = 52 }: { node: Node; x: number; y: number; w?: number; h?: number }) {
  if (node.kind === 'data') return <DataBox x={x} y={y} w={w} h={h} label={node.label} sub={node.sub} color={node.color} />;
  if (node.kind === 'action') return <ActionBox x={x} y={y} w={w} h={h} label={node.label} sub={node.sub} color={node.color} />;
  if (node.kind === 'status') return <StatusBox x={x} y={y} w={w} h={h} label={node.label} sub={node.sub} color={node.color} progress={0.62} />;
  if (node.kind === 'alert') return <AlertBox x={x} y={y} w={w} h={h} label={node.label} sub={node.sub} color={node.color} />;
  return <ModuleBox x={x} y={y} w={w} h={h} label={node.label} sub={node.sub} color={node.color} />;
}

function FrontierMap({ active }: { active: number }) {
  const reduceMotion = useReducedMotion();
  const current = nodes[active];

  return (
    <div className="w-full" data-reasoning-frontier-map>
      <svg viewBox="0 0 360 210" className="block aspect-[360/210] w-full sm:hidden" role="img" aria-label={`${current.label} 병목 확대 장면`}>
        <motion.g initial={false} animate={{ y: reduceMotion ? 0 : -3 }}>
          <SemanticNode node={current} x={70} y={65} w={220} h={72} />
        </motion.g>
        <text x="180" y="32" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">현재 병목 확대</text>
        <text x="180" y="174" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">{active + 1} / {nodes.length} · 다음 장면에서 별도 계약으로 이동</text>
      </svg>

      <svg viewBox="0 0 700 240" className="hidden aspect-[700/240] w-full sm:block" role="img" aria-label="Reasoning post-training의 다섯 병목 지도">
        <defs>
          <marker id="reasoning-frontier-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" opacity="0.5" />
          </marker>
        </defs>
        {nodes.slice(0, -1).map((_, index) => {
          const start = 16 + index * 136 + 118;
          const end = 16 + (index + 1) * 136;
          return <motion.path key={start} d={`M ${start} 109 C ${start + 7} 109, ${end - 7} 109, ${end} 109`} fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#reasoning-frontier-arrow)" initial={false} animate={{ opacity: index < active ? 0.65 : 0.16 }} />;
        })}
        {nodes.map((node, index) => (
          <motion.g key={node.label} initial={false} animate={{ opacity: index <= active ? 1 : 0.28, y: index === active && !reduceMotion ? -4 : 0 }}>
            <SemanticNode node={node} x={16 + index * 136} y={83} />
          </motion.g>
        ))}
        <motion.path d={`M ${75 + active * 136} 143 C ${75 + active * 136} 166, 350 166, 350 186`} fill="none" stroke={current.color} strokeWidth="1.3" strokeDasharray="5 4" initial={false} animate={{ opacity: 0.65 }} />
        <StatusBox x={270} y={186} w={160} h={46} label="다음 실험 계약" sub="숫자·증거로 검증" color={current.color} progress={(active + 1) / nodes.length} />
      </svg>

      <p className="mt-3 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
        읽는 순서: <strong className="text-foreground">비용 축</strong>을 분리한 뒤 <strong className="text-foreground">credit → exploration → stopping → evidence</strong>를 각각 측정한다.
      </p>
    </div>
  );
}

export default function ReasoningFrontierMapViz() {
  return <StepViz steps={steps}>{(step) => <FrontierMap active={step} />}</StepViz>;
}
