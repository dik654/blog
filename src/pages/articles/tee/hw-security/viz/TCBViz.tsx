import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'Application', color: '#ef4444', y: 10, trust: false },
  { label: 'OS / Hypervisor', color: '#f59e0b', y: 45, trust: false },
  { label: 'Firmware / BIOS', color: '#8b5cf6', y: 80, trust: false },
  { label: 'CPU + Root of Trust', color: '#10b981', y: 115, trust: true },
];

const STEPS = [
  { label: '전통 모델: 전체 스택이 TCB에 포함' },
  { label: 'TEE 모델: TCB를 CPU + 펌웨어로 축소' },
  { label: '위협 모델: 악성 OS도 공격자로 가정' },
  { label: '신뢰 앵커: 하드웨어 Root of Trust에서 시작' },
];
const BODY = [
  'TCB가 크면 취약점도 많아짐',
  'SGX/SEV는 OS를 신뢰하지 않음',
  'OS, 하이퍼바이저, 관리자 모두 비신뢰',
  'CPU 내장 키에서 신뢰 체인이 시작',
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function TCBViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* TCB boundary */}
          {step === 0 && (
            <motion.rect x={15} y={5} width={250} height={148} rx={8}
              fill="#ef444408" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
          )}
          {step >= 1 && (
            <motion.rect x={15} y={75} width={250} height={78} rx={8}
              fill="#10b98108" stroke="#10b981" strokeWidth={1.5} strokeDasharray="6 3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
          )}
          <text x={20} y={step === 0 ? 18 : 88} fontSize={10} fontWeight={600}
            fill={step === 0 ? '#ef4444' : '#10b981'}>TCB 범위</text>

          {/* Stack layers */}
          {LAYERS.map((l, i) => {
            const inTCB = step === 0 ? true : l.trust || (step >= 1 && i >= 2);
            const threatened = step === 2 && i <= 1;
            const color = threatened ? '#ef4444' : l.color;
            return (
              <motion.g key={i} animate={{ opacity: step >= 1 && i <= 1 ? 0.4 : 1 }} transition={sp}>
                <rect x={30} y={l.y} width={220} height={28} rx={5}
                  fill={`${color}12`} stroke={color}
                  strokeWidth={inTCB && step >= 1 ? 1.5 : 0.8} />
                <text x={140} y={l.y + 18} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={color}>{l.label}</text>
                {threatened && (
                  <motion.text x={260} y={l.y + 18} fontSize={10} fill="#ef4444"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>비신뢰</motion.text>
                )}
              </motion.g>
            );
          })}

          {/* Root of Trust highlight */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={310} y={115} width={160} height={28} rx={5}
                fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
              <text x={390} y={127} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>
                Root of Trust (HW Key)
              </text>
              <text x={390} y={140} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                변조 불가 · 신뢰 체인 시작점
              </text>
            </motion.g>
          )}

          <motion.text x={310} y={30} fontSize={10} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
