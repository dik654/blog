import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: 'MPC 세레모니', sub: 'τ 생성 + 폐기', color: '#6366f1', x: 10, y: 8 },
  { label: 'SRS', sub: '[τ⁰]₁…[τᵈ]₁', color: '#10b981', x: 10, y: 48 },
  { label: 'f(x)', sub: '다항식', color: '#a855f7', x: 120, y: 8 },
  { label: 'Commit', sub: '[f(τ)]₁ = 64B', color: '#f59e0b', x: 120, y: 48 },
  { label: 'Open', sub: 'q=(f-y)/(x-z)', color: '#8b5cf6', x: 230, y: 28 },
  { label: 'Verify', sub: '페어링 2회', color: '#ef4444', x: 230, y: 68 },
];
const BW = 76, BH = 26;

const STEPS = [
  { label: 'Universal Setup — MPC로 τ 생성', body: 'MPC 세레모니로 비밀 τ를 생성합니다. 1회만 수행하며 모든 다항식에 재사용.' },
  { label: 'SRS 생성 — τ의 거듭제곱', body: '[τ⁰]₁, [τ¹]₁, …, [τᵈ]₁ — τ의 거듭제곱을 타원곡선 점으로 인코딩.' },
  { label: 'Commit — MSM으로 압축', body: 'C = Σ fᵢ·[τⁱ]₁ = [f(τ)]₁ — 다항식을 G1 점 하나(64바이트)로 압축.' },
  { label: 'Open — 인수정리 증명', body: 'f(z)=y 증명: q(x)=(f(x)-y)/(x-z) 계산 후 [q(τ)]₁ 전송.' },
  { label: 'Verify — 페어링 2회 O(1)', body: 'e(π,[τ-z]₂) = e(C-[y]₁,G₂). 페어링 2회로 검증.' },
];

export default function KZGFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = step >= i;
            const glow = step === i;
            return (
              <g key={n.label}>
                <motion.rect x={n.x} y={n.y} width={BW} height={BH} rx={4}
                  animate={{ fill: active ? `${n.color}20` : `${n.color}06`,
                    stroke: n.color, strokeWidth: glow ? 2 : 0.5, opacity: active ? 1 : 0.15 }}
                  transition={sp} />
                <text x={n.x + BW / 2} y={n.y + 11} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={n.color} opacity={active ? 1 : 0.2}>{n.label}</text>
                <text x={n.x + BW / 2} y={n.y + 21} textAnchor="middle" fontSize={9}
                  fill={n.color} opacity={active ? 0.5 : 0.1}>{n.sub}</text>
              </g>
            );
          })}
          {/* arrows: MPC→SRS */}
          <motion.line x1={48} y1={34} x2={48} y2={47}
            stroke="#10b981" strokeWidth={0.6}
            animate={{ opacity: step >= 1 ? 0.5 : 0.05 }} transition={sp} />
          {/* SRS→Commit, f(x)→Commit */}
          <motion.line x1={88} y1={61} x2={119} y2={61}
            stroke="#f59e0b" strokeWidth={0.6}
            animate={{ opacity: step >= 2 ? 0.5 : 0.05 }} transition={sp} />
          <motion.line x1={158} y1={34} x2={158} y2={47}
            stroke="#f59e0b" strokeWidth={0.6}
            animate={{ opacity: step >= 2 ? 0.5 : 0.05 }} transition={sp} />
          {/* Commit→Open */}
          <motion.line x1={198} y1={55} x2={229} y2={44}
            stroke="#8b5cf6" strokeWidth={0.6}
            animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} transition={sp} />
          {/* Open→Verify, Commit→Verify */}
          <motion.line x1={268} y1={54} x2={268} y2={67}
            stroke="#ef4444" strokeWidth={0.6}
            animate={{ opacity: step >= 4 ? 0.5 : 0.05 }} transition={sp} />
          <motion.line x1={198} y1={68} x2={229} y2={74}
            stroke="#ef4444" strokeWidth={0.6}
            animate={{ opacity: step >= 4 ? 0.5 : 0.05 }} transition={sp} />
        </svg>
      )}
    </StepViz>
  );
}
