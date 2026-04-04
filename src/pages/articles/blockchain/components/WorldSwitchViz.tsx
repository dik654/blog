import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const ZONES = [
  { label: 'Normal\nWorld', x: 40, color: '#6366f1' },
  { label: 'Monitor\nMode', x: 160, color: '#f59e0b' },
  { label: 'Secure\nWorld', x: 280, color: '#10b981' },
];
const BY = 55;

const STEPS = [
  { label: '① NS에서 SMC 호출', body: '비보안 세계에서 SMC 명령어 실행. FID bit[31]로 fast/standard 분기.' },
  { label: '② Monitor 진입 — 레지스터 저장', body: 'CPU가 Monitor Mode 전환. SCR.NS=0, r4-r12·LR 등 비보안 레지스터 저장.' },
  { label: '③ FID 디스패치 → Secure OS', body: 'Monitor가 FID별 핸들러로 분기. OP-TEE OS에서 TA 명령 처리.' },
  { label: '④ Monitor 복귀 → NS 반환', body: 'SCR.NS=1 복원. 보안 레지스터 복원 후 비보안 세계로 SMC 반환값 전달.' },
];

export default function WorldSwitchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* zones */}
          {ZONES.map((z, i) => {
            const active = (step === 0 && i === 0) || (step === 1 && i === 1) ||
              (step === 2 && i === 2) || (step === 3 && (i === 1 || i === 0));
            return (
              <g key={z.label}>
                <motion.rect x={z.x - 30} y={BY - 20} width={60} height={40} rx={6}
                  animate={{ fill: active ? `${z.color}20` : `${z.color}06`,
                    stroke: z.color, strokeWidth: active ? 2 : 0.8 }} transition={sp} />
                {z.label.split('\n').map((line, li) => (
                  <text key={li} x={z.x} y={BY - 6 + li * 11} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={z.color} opacity={active ? 1 : 0.4}>{line}</text>
                ))}
              </g>
            );
          })}
          {/* arrows step 0-1: NS → Monitor */}
          {step >= 0 && (
            <motion.line x1={72} y1={BY} x2={128} y2={BY}
              stroke="#6366f1" strokeWidth={1.2} markerEnd="url(#ws)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp} />
          )}
          {/* arrow step 1-2: Monitor → Secure */}
          {step >= 2 && (
            <motion.line x1={192} y1={BY} x2={248} y2={BY}
              stroke="#10b981" strokeWidth={1.2} markerEnd="url(#ws)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp} />
          )}
          {/* return arrows step 3 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={sp}>
              <line x1={248} y1={BY + 8} x2={192} y2={BY + 8}
                stroke="#f59e0b" strokeWidth={1} markerEnd="url(#ws)" />
              <line x1={128} y1={BY + 8} x2={72} y2={BY + 8}
                stroke="#6366f1" strokeWidth={1} markerEnd="url(#ws)" />
            </motion.g>
          )}
          {/* SCR.NS indicator */}
          <motion.text x={160} y={96} textAnchor="middle" fontSize={9} fontWeight={600}
            animate={{ fill: step <= 2 ? '#f59e0b' : '#6366f1' }} transition={sp}>
            SCR.NS = {step >= 1 && step <= 2 ? '0 (보안)' : '1 (비보안)'}
          </motion.text>
          <defs>
            <marker id="ws" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
