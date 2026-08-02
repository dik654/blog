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
          <svg data-permission-mode-viz viewBox="0 0 360 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* tool call source */}
            <motion.rect x={10} y={43} width={60} height={34} rx={5}
              animate={{ fill: '#3b82f618', stroke: '#3b82f6', strokeWidth: step === 0 ? 2 : 1 }} />
            <text x={40} y={64} textAnchor="middle" fontSize={13} fontWeight={700} fill="#3b82f6">도구 호출</text>
            {/* 3 mode barriers */}
            {MODES.map((m, i) => {
              const bx = 82 + i * 82, by = 94 - m.barrier;
              const active = modeIdx === i;
              return (
                <g key={m.label}>
                  <motion.rect x={bx} y={by} width={50} height={m.barrier} rx={4}
                    animate={{ fill: `${m.color}${active ? '30' : '10'}`,
                      stroke: m.color, strokeWidth: active ? 2 : 0.8 }}
                    transition={{ duration: 0.3 }} />
                  <text x={bx + 25} y={104} textAnchor="middle" fontSize={13}
                    fontWeight={600} fill={m.color}>{m.label}</text>
                  <text x={bx + 25} y={122} textAnchor="middle" fontSize={13}
                    fill="var(--muted-foreground)">장벽 {m.barrier}%</text>
                  {/* packet attempt */}
                  {active && (
                    <motion.circle r={5}
                      initial={{ cx: bx - 12, cy: 60 }}
                      animate={{ cx: m.pass ? bx + 60 : bx - 3, cy: 60 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      fill={m.pass ? '#10b981' : '#ef4444'}
                      style={{ filter: `drop-shadow(0 0 4px ${m.pass ? '#10b981' : '#ef4444'}88)` }} />
                  )}
                  {active && !m.pass && (
                    <motion.text x={bx - 4} y={51} textAnchor="middle" fontSize={13}
                      fill="#ef4444" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      차단
                    </motion.text>
                  )}
                  {active && m.pass && (
                    <motion.text x={bx + 61} y={53} fontSize={13}
                      fill="#10b981" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      통과
                    </motion.text>
                  )}
                </g>
              );
            })}
            {/* step 0 arrow */}
            {step === 0 && (
              <motion.path d="M 70 60 L 76 60" fill="none" stroke="#3b82f6"
                strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }} />
            )}
            <motion.g key={step} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={10} y={128} width={340} height={18} rx={4}
                fill="var(--muted)" fillOpacity={0.5} />
              <text x={180} y={140} textAnchor="middle" fontSize={13}
                fill="var(--foreground)" fontWeight={600}>{BODY[step]}</text>
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
