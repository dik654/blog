import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '① 트랜잭션 암호화: X25519 + AES-256-GCM' },
  { label: '② SGX 내 실행: 키 매니저에서 Contract Key 수령' },
  { label: '③ 상태 암호화: Contract Key로 스토리지 암호화' },
  { label: '④ 응답 반환: 세션키로 결과 암호화' },
];
const ANNOT = ['calldata X25519 암호화', 'SGX Quote 검증 후 키 제공', 'AES-256-GCM 스토리지 암호화', 'X25519 세션키 결과 암호화'];

const ACTORS = [
  { label: '클라이언트', x: 40, color: '#6366f1' },
  { label: 'Sapphire', x: 155, color: '#10b981' },
  { label: 'KM (SGX)', x: 270, color: '#f59e0b' },
  { label: '합의 체인', x: 345, color: '#8b5cf6' },
];

const ARROWS = [
  { from: 0, to: 1, color: '#6366f1' },
  { from: 1, to: 2, color: '#10b981' },
  { from: 1, to: 3, color: '#f59e0b' },
  { from: 1, to: 0, color: '#8b5cf6' },
];

export default function SapphireFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Actor lifelines */}
          {ACTORS.map((a) => (
            <g key={a.label}>
              <line x1={a.x} y1={30} x2={a.x} y2={150} stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3" />
              <rect x={a.x - 30} y={8} width={60} height={22} rx={4} fill={`${a.color}15`} stroke={a.color} strokeWidth={1} />
              <text x={a.x} y={23} textAnchor="middle" fontSize={10} fontWeight={600} fill={a.color}>{a.label}</text>
            </g>
          ))}
          {/* Arrows per step */}
          {ARROWS.map((ar, i) => {
            const active = i === step;
            const done = i < step;
            const y = 48 + i * 28;
            const x1 = ACTORS[ar.from].x;
            const x2 = ACTORS[ar.to].x;
            return (
              <g key={i}>
                <motion.line x1={x1} y1={y} x2={x2} y2={y}
                  stroke={active ? ar.color : done ? ar.color : 'var(--border)'}
                  strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : done ? 0.4 : 0.15 }}
                  transition={{ duration: 0.3 }} />
                {/* arrowhead */}
                <motion.polygon
                  points={x2 > x1 ? `${x2 - 6},${y - 4} ${x2},${y} ${x2 - 6},${y + 4}` : `${x2 + 6},${y - 4} ${x2},${y} ${x2 + 6},${y + 4}`}
                  fill={active ? ar.color : done ? ar.color : 'var(--border)'}
                  animate={{ opacity: active ? 1 : done ? 0.4 : 0.15 }} />
                {/* packet */}
                {active && (
                  <motion.circle r={5} cy={y} fill={ar.color}
                    initial={{ cx: x1 }} animate={{ cx: x2 }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }} />
                )}
              </g>
            );
          })}
          <motion.text x={405} y={80} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
