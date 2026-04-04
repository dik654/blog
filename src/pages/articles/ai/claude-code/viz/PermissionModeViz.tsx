import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MODES = [
  { label: 'Ask', barrier: 70, color: '#6366f1', pass: false },
  { label: 'Auto', barrier: 45, color: '#f59e0b', pass: true },
  { label: 'YOLO', barrier: 18, color: '#ec4899', pass: true },
];

const STEPS = [
  { label: '도구 호출 도착' },
  { label: 'Ask 모드 (엄격)' },
  { label: 'Auto 모드 (기본)' },
  { label: 'YOLO 모드 (허용)' },
];
const BODY = [
  'tool_use 블록 → 권한 검사 전달',
  '모든 호출에 사용자 승인 필요',
  '읽기 도구 자동 허용, 쓰기 도구 승인',
  '거의 모든 도구 자동 허용',
];

export default function PermissionModeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const modeIdx = step === 0 ? -1 : step - 1;
        return (
          <svg viewBox="0 0 480 128" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* tool call source */}
            <motion.rect x={10} y={40} width={55} height={34} rx={5}
              animate={{ fill: '#3b82f618', stroke: '#3b82f6', strokeWidth: step === 0 ? 2 : 1 }} />
            <text x={37} y={61} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Tool Call</text>
            {/* 3 mode barriers */}
            {MODES.map((m, i) => {
              const bx = 110 + i * 85, by = 90 - m.barrier;
              const active = modeIdx === i;
              return (
                <g key={m.label}>
                  <motion.rect x={bx} y={by} width={50} height={m.barrier} rx={4}
                    animate={{ fill: `${m.color}${active ? '30' : '10'}`,
                      stroke: m.color, strokeWidth: active ? 2 : 0.8 }}
                    transition={{ duration: 0.3 }} />
                  <text x={bx + 25} y={100} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={m.color}>{m.label}</text>
                  <text x={bx + 25} y={110} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">장벽 {m.barrier}%</text>
                  {/* packet attempt */}
                  {active && (
                    <motion.circle r={5}
                      initial={{ cx: bx - 15, cy: 57 }}
                      animate={{ cx: m.pass ? bx + 65 : bx - 3, cy: 57 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      fill={m.pass ? '#10b981' : '#ef4444'}
                      style={{ filter: `drop-shadow(0 0 4px ${m.pass ? '#10b981' : '#ef4444'}88)` }} />
                  )}
                  {active && !m.pass && (
                    <motion.text x={bx - 5} y={50} textAnchor="middle" fontSize={9}
                      fill="#ef4444" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      차단
                    </motion.text>
                  )}
                  {active && m.pass && (
                    <motion.text x={bx + 68} y={53} fontSize={9}
                      fill="#10b981" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      통과
                    </motion.text>
                  )}
                </g>
              );
            })}
            {/* step 0 arrow */}
            {step === 0 && (
              <motion.path d="M 65 57 L 100 57" fill="none" stroke="#3b82f6"
                strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }} />
            )}
            {/* inline body text */}
            <motion.text x={375} y={57} fontSize={9}
              fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
