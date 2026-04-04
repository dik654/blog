import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Initializing: FastResume 로드 & 무결성 검사' },
  { label: 'ChunkTracker 생성: 피스별 진행 추적' },
  { label: 'Live: 피어에서 피스 다운로드' },
  { label: 'Paused: 상태 보존 & 비트필드 저장' },
];

const ANNOT = ['FastResume 비트필드 로드', 'ChunkTracker 피스 추적', 'Choke/Unchoke 피스 다운로드', 'Paused 상태 보존 저장'];
const STATES = [
  { label: 'Init', color: '#f59e0b' },
  { label: 'Paused', color: '#3b82f6' },
  { label: 'Live', color: '#10b981' },
  { label: 'Error', color: '#ef4444' },
];

export default function PieceManagerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {STATES.map((s, i) => {
            const cx = 50 + i * 90;
            const activeIdx = step === 3 ? 1 : step === 2 ? 2 : step === 1 ? 2 : 0;
            const active = i === activeIdx;
            return (
              <g key={s.label}>
                <motion.rect x={cx - 32} y={30} width={64} height={36} rx={10}
                  fill={active ? `${s.color}22` : `${s.color}08`}
                  stroke={active ? s.color : `${s.color}30`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ y: active ? 24 : 30 }}
                  transition={{ type: 'spring', bounce: 0.3 }} />
                <text x={cx} y={52} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? s.color : 'var(--muted-foreground)'}>
                  {s.label}
                </text>
              </g>
            );
          })}
          {/* Transition arrows */}
          {[{x1: 82, x2: 140}, {x1: 172, x2: 230}, {x1: 262, x2: 320}].map((a, i) => (
            <line key={i} x1={a.x1} y1={48} x2={a.x2} y2={48}
              stroke="var(--border)" strokeWidth={1.5}
              markerEnd="url(#ah3)" />
          ))}
          {/* Progress bar */}
          <rect x={40} y={100} width={280} height={16} rx={4} fill="var(--border)" />
          <motion.rect x={40} y={100} rx={4} height={16}
            fill={STATES[step === 3 ? 1 : Math.min(step, 2)].color}
            animate={{ width: step === 0 ? 40 : step === 1 ? 120 : step === 2 ? 230 : 180 }}
            transition={{ duration: 0.5 }} />
          <text x={180} y={112} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">
            {['검사 중...', '트래커 준비', '다운로드 중', '일시정지'][step]}
          </text>
          {/* Piece grid */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.rect key={i} x={42 + i * 20} y={130} width={16} height={12} rx={2}
              fill={i < (step === 0 ? 2 : step === 1 ? 6 : step === 2 ? 12 : 9)
                ? '#10b98140' : 'var(--border)'}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }} />
          ))}
          <defs>
            <marker id="ah3" markerWidth={6} markerHeight={5} refX={6} refY={2.5} orient="auto">
              <path d="M0,0 L6,2.5 L0,5" fill="var(--muted-foreground)" />
            </marker>
          </defs>
                  <motion.text x={365} y={80} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
