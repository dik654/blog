import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력 도착' },
  { label: 'Forget Gate (σ)' },
  { label: 'Input Gate + Candidate' },
  { label: '셀 상태 업데이트' },
  { label: '출력 (h_t 생성)' },
];
const BODY = [
  'x_t와 h_{t-1} 셀 도착',
  'σ로 버릴 정보 결정',
  'σ 저장비율 × tanh 후보값',
  'C_t = f×C_{t-1} + i×C̃_t',
  'Output Gate × tanh(C_t)',
];

const GATES = [
  { x: 140, name: 'Forget', color: '#ef4444', step: 1 },
  { x: 230, name: 'Input', color: '#10b981', step: 2 },
  { x: 320, name: 'Output', color: '#ec4899', step: 4 },
];
const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

export default function LSTMCellFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 560 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Conveyor belt */}
          <line x1={60} y1={70} x2={400} y2={70} stroke="var(--border)" strokeWidth={1.5} />
          <rect x={20} y={65} width={20} height={13} rx={2} fill="var(--card)" />
          <text x={30} y={74} fontSize={9} fill="var(--muted-foreground)" textAnchor="middle">C</text>
          {[100, 170, 260, 350].map(cx => (
            <motion.circle key={cx} cx={cx} cy={70} r={2.5} fill="var(--muted-foreground)"
              animate={{ opacity: step >= 3 ? 0.8 : 0.2, x: step >= 3 ? 12 : 0 }} transition={sp} />
          ))}
          {/* Gates as vertical barriers */}
          {GATES.map(g => {
            const open = step >= g.step, active = step === g.step;
            return (
              <g key={g.name}>
                <motion.rect x={g.x - 12} width={24} rx={2} transition={sp}
                  animate={{ height: open ? 4 : 36, y: open ? 48 : 52, fill: active ? g.color : open ? `${g.color}88` : `${g.color}33` }} />
                <text x={g.x} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                  style={{ fill: active ? g.color : 'var(--muted-foreground)' }}>{g.name}</text>
                <text x={g.x} y={102} textAnchor="middle" fontSize={9} fill={g.color} opacity={active ? 1 : 0.4}>σ</text>
              </g>
            );
          })}
          {/* Input packets */}
          {[{ y: 115, label: 'x_t', c: '#6366f1' }, { y: 140, label: 'h_{t-1}', c: '#0ea5e9' }].map(p => (
            <motion.g key={p.label} animate={{ x: step >= 1 ? 80 : 0 }} transition={sp}>
              <rect x={60} y={p.y} width={40} height={18} rx={4} fill={`${p.c}30`} stroke={p.c} strokeWidth={1.5} />
              <text x={80} y={p.y + 13} textAnchor="middle" fontSize={9} fontWeight={600} fill={p.c}>{p.label}</text>
            </motion.g>
          ))}
          {/* Candidate tanh */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={210} y={108} width={40} height={16} rx={4} fill="#f59e0b22" stroke="#f59e0b" strokeWidth={1} />
              <text x={230} y={120} textAnchor="middle" fontSize={9} fill="#f59e0b">C̃_t tanh</text>
              <line x1={230} y1={108} x2={230} y2={88} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
            </motion.g>
          )}
          {/* Cell state update label */}
          {step >= 3 && (
            <motion.text x={275} y={62} textAnchor="middle" fontSize={9} fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 1, fill: '#8b5cf6' }}>C_t 갱신</motion.text>
          )}
          {/* Output h_t */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <rect x={370} y={108} width={50} height={22} rx={6} fill="#0ea5e920" stroke="#0ea5e9" strokeWidth={1.5} />
              <text x={395} y={123} textAnchor="middle" fontSize={9} fontWeight={600} fill="#0ea5e9">h_t</text>
              <line x1={370} y1={70} x2={395} y2={108} stroke="#ec4899" strokeWidth={1.5} strokeDasharray="3 2" />
            </motion.g>
          )}
          {/* Data packet on conveyor */}
          <motion.circle r={6} fill="#8b5cf6" style={{ filter: 'drop-shadow(0 0 4px #8b5cf699)' }}
            animate={{ cx: [70, 140, 230, 290, 360][step], cy: 70 }} transition={sp} />
          <motion.text x={450} y={85} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
