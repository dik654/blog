import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: '변수 생성', sub: 'alloc(v)', color: '#6366f1', x: 10, y: 12 },
  { label: '와이어 연결', sub: 'w_l, w_r, w_o', color: '#10b981', x: 100, y: 12 },
  { label: '선택자 설정', sub: 'q_m, q_l, ...', color: '#f59e0b', x: 190, y: 12 },
  { label: '게이트 추가', sub: 'poly_gate()', color: '#8b5cf6', x: 100, y: 60 },
];
const BW = 78, BH = 28;

const STEPS = [
  { label: '① 변수 생성 — alloc()', body: 'Variable(index)로 witness 등록' },
  { label: '② 와이어 연결 — w_l, w_r, w_o, w_4', body: 'left/right/output wire에 배치' },
  { label: '③ 선택자 설정 — q_m, q_l, q_r, q_o, q_c', body: 'selector 값으로 게이트 동작 설정' },
  { label: '④ 게이트 추가 — perm 갱신', body: 'poly_gate()로 perm map 등록' },
];

export default function ComposerFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 430 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = step >= i;
            const glow = step === i;
            return (
              <g key={n.label}>
                <motion.rect x={n.x} y={n.y} width={BW} height={BH} rx={4}
                  animate={{ fill: active ? `${n.color}20` : `${n.color}06`,
                    stroke: n.color, strokeWidth: glow ? 2.2 : 0.5, opacity: active ? 1 : 0.15 }}
                  transition={sp} />
                <text x={n.x + BW / 2} y={n.y + 12} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={n.color} opacity={active ? 1 : 0.2}>{n.label}</text>
                <text x={n.x + BW / 2} y={n.y + 22} textAnchor="middle" fontSize={9}
                  fill={n.color} opacity={active ? 0.5 : 0.1}>{n.sub}</text>
              </g>
            );
          })}
          {/* arrows: var→wire, wire→sel */}
          <motion.line x1={89} y1={26} x2={99} y2={26}
            stroke="#10b981" strokeWidth={0.6}
            animate={{ opacity: step >= 1 ? 0.5 : 0.05 }} transition={sp} />
          <motion.line x1={179} y1={26} x2={189} y2={26}
            stroke="#f59e0b" strokeWidth={0.6}
            animate={{ opacity: step >= 2 ? 0.5 : 0.05 }} transition={sp} />
          {/* wire→gate, sel→gate */}
          <motion.line x1={139} y1={40} x2={139} y2={59}
            stroke="#8b5cf6" strokeWidth={0.6}
            animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} transition={sp} />
          <motion.line x1={210} y1={40} x2={170} y2={59}
            stroke="#8b5cf6" strokeWidth={0.6}
            animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} transition={sp} />
        </svg>
      )}
    </StepViz>
  );
}
