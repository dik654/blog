import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: '회로 작성', sub: '게이트 + 와이어', color: '#6366f1', x: 10, y: 10 },
  { label: '전처리', sub: '선택자/순열 다항식', color: '#10b981', x: 105, y: 10 },
  { label: 'SRS', sub: 'MPC 세레모니', color: '#f59e0b', x: 200, y: 10 },
  { label: 'pk 생성', sub: 'Prover Key', color: '#8b5cf6', x: 60, y: 58 },
  { label: 'vk 생성', sub: 'Verifier Key', color: '#ec4899', x: 170, y: 58 },
];
const BW = 78, BH = 28;

const STEPS = [
  { label: '① 회로 작성', body: 'Composer로 게이트와 와이어를 정의. 변수 할당, 제약 조건 설정.' },
  { label: '② 전처리 — 다항식 생성', body: '선택자 q_M(X),..., 순열 σ(X) 등을 Lagrange 보간으로 생성.' },
  { label: '③ SRS 로드', body: 'MPC 세레모니로 생성된 universal SRS를 로드. τ의 거듭제곱.' },
  { label: '④ Prover Key — 증명에 필요한 모든 것', body: 'SRS + 선택자/순열 다항식 + 도메인 정보를 결합.' },
  { label: '⑤ Verifier Key — 검증에 필요한 최소 정보', body: '선택자/순열 commitments + [τ]₂ + 도메인 크기. 소형.' },
];

export default function CircuitCompileViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = step >= i;
            const glow = step === i;
            return (
              <g key={n.label}>
                <motion.rect x={n.x} y={n.y} width={BW} height={BH} rx={4}
                  animate={{ fill: active ? `${n.color}20` : `${n.color}06`,
                    stroke: n.color, strokeWidth: glow ? 2 : 0.5, opacity: active ? 1 : 0.15 }}
                  transition={sp} />
                <text x={n.x + BW / 2} y={n.y + 12} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={n.color} opacity={active ? 1 : 0.2}>{n.label}</text>
                <text x={n.x + BW / 2} y={n.y + 22} textAnchor="middle" fontSize={9}
                  fill={n.color} opacity={active ? 0.5 : 0.1}>{n.sub}</text>
              </g>
            );
          })}
          {/* top row arrows */}
          <motion.line x1={89} y1={24} x2={104} y2={24}
            stroke="#10b981" strokeWidth={0.6}
            animate={{ opacity: step >= 1 ? 0.5 : 0.05 }} transition={sp} />
          <motion.line x1={184} y1={24} x2={199} y2={24}
            stroke="#f59e0b" strokeWidth={0.6}
            animate={{ opacity: step >= 2 ? 0.5 : 0.05 }} transition={sp} />
          {/* to pk, vk */}
          <motion.line x1={144} y1={38} x2={99} y2={57}
            stroke="#8b5cf6" strokeWidth={0.5}
            animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} transition={sp} />
          <motion.line x1={239} y1={38} x2={209} y2={57}
            stroke="#ec4899" strokeWidth={0.5}
            animate={{ opacity: step >= 4 ? 0.5 : 0.05 }} transition={sp} />
          <motion.line x1={144} y1={38} x2={182} y2={57}
            stroke="#ec4899" strokeWidth={0.5}
            animate={{ opacity: step >= 4 ? 0.5 : 0.05 }} transition={sp} />
        </svg>
      )}
    </StepViz>
  );
}
