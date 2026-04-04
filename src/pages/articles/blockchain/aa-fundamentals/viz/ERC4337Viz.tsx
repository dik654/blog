import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'ERC-4337 흐름', body: 'User → UserOp → Bundler → EntryPoint → Smart Account. 프로토콜 변경 없이 AA 구현.' },
  { label: 'UserOp 생성', body: '사용자가 UserOperation 생성. sender, callData, signature 포함. Alt Mempool에 제출.' },
  { label: 'Bundler 번들링', body: 'Bundler가 여러 UserOp를 수집. 시뮬레이션으로 유효성 검증 후 하나의 TX로 번들링.' },
  { label: 'EntryPoint 실행', body: 'validateUserOp() → Paymaster 검증 → execute(). 검증-실행 분리로 DoS 방지.' },
];

const FLOW = [
  { label: 'User', x: 30, color: C1 },
  { label: 'Bundler', x: 145, color: C2 },
  { label: 'EntryPoint', x: 270, color: C3 },
  { label: 'Account', x: 380, color: C1 },
];

export default function ERC4337Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Flow nodes */}
          {FLOW.map((f, i) => {
            const active = (step === 1 && i === 0) || (step === 2 && i === 1) ||
              (step === 3 && i >= 2) || step === 0;
            return (
              <motion.g key={f.label} animate={{ opacity: active ? 1 : 0.25 }}>
                <rect x={f.x - 30} y={30} width={60} height={28} rx={5}
                  fill={`${f.color}${active ? '12' : '06'}`}
                  stroke={f.color} strokeWidth={active ? 1.2 : 0.5} />
                <text x={f.x} y={48} textAnchor="middle" fontSize={10} fontWeight={500} fill={f.color}>
                  {f.label}
                </text>
              </motion.g>
            );
          })}
          {/* Arrows between nodes */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={60} y1={44} x2={115} y2={44} stroke={C1} strokeWidth={0.7} />
              <rect x={68} y={35} width={40} height={12} rx={2} fill="none" stroke={C1} strokeWidth={0.4} />
              <text x={88} y={44} textAnchor="middle" fontSize={10} fill={C1}>UserOp</text>
            </motion.g>
          )}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={175} y1={44} x2={240} y2={44} stroke={C2} strokeWidth={0.7} />
              <rect x={183} y={35} width={50} height={12} rx={2} fill="none" stroke={C2} strokeWidth={0.4} />
              <text x={208} y={44} textAnchor="middle" fontSize={10} fill={C2}>handleOps</text>
            </motion.g>
          )}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={300} y1={44} x2={350} y2={44} stroke={C3} strokeWidth={0.7} />
              <rect x={305} y={35} width={45} height={12} rx={2} fill="none" stroke={C3} strokeWidth={0.4} />
              <text x={328} y={44} textAnchor="middle" fontSize={10} fill={C3}>execute</text>
            </motion.g>
          )}
          {/* Paymaster */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={230} y={75} width={80} height={24} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
              <text x={270} y={90} textAnchor="middle" fontSize={10} fill={C2}>Paymaster</text>
              <line x1={270} y1={58} x2={270} y2={75} stroke={C2} strokeWidth={0.5} strokeDasharray="2,2" />
            </motion.g>
          )}
          {/* Phase labels */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={100} y={110} width={220} height={22} rx={4} fill={`${C3}08`} stroke={C3} strokeWidth={0.6} />
              <text x={210} y={124} textAnchor="middle" fontSize={10} fill={C3}>
                validate → paymaster check → execute (분리)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
