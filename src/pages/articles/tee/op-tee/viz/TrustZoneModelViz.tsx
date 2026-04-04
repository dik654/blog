import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'Normal World: 리눅스 커널(EL1) + 일반 앱(EL0)',
  'Secure World: OP-TEE OS(S.EL1) + TA(S.EL0)',
  'Secure Monitor(EL3): SMC로 세계 전환 수행',
  'TZASC: 물리 메모리를 Secure/Non-Secure로 분리',
];

const C = { nw: '#6366f1', sw: '#10b981', mon: '#f59e0b' };

export default function TrustZoneModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Normal World */}
          <motion.rect x={30} y={20} width={220} height={100} rx={8}
            fill={step === 0 ? `${C.nw}14` : `${C.nw}06`}
            stroke={step === 0 ? C.nw : `${C.nw}40`} strokeWidth={step === 0 ? 1.5 : 1}
            animate={{ opacity: step === 0 ? 1 : 0.4 }} />
          <text x={140} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.nw}>Normal World</text>
          <text x={60} y={60} fontSize={10} fill="var(--muted-foreground)">Linux (EL1)</text>
          <text x={60} y={76} fontSize={10} fill="var(--muted-foreground)">Apps (EL0)</text>
          <motion.rect x={60} y={90} width={160} height={18} rx={3}
            fill={`${C.nw}10`} stroke={`${C.nw}30`} strokeWidth={0.5}
            animate={{ opacity: step === 0 ? 0.8 : 0.2 }} />
          <text x={140} y={103} textAnchor="middle" fontSize={10} fill={C.nw}>smc #0 호출</text>

          {/* Secure World */}
          <motion.rect x={290} y={20} width={220} height={100} rx={8}
            fill={step === 1 ? `${C.sw}14` : `${C.sw}06`}
            stroke={step === 1 ? C.sw : `${C.sw}40`} strokeWidth={step === 1 ? 1.5 : 1}
            animate={{ opacity: step === 1 ? 1 : 0.4 }} />
          <text x={400} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sw}>Secure World</text>
          <text x={310} y={60} fontSize={10} fill="var(--muted-foreground)">OP-TEE OS (S.EL1)</text>
          <text x={310} y={76} fontSize={10} fill="var(--muted-foreground)">TA (S.EL0)</text>
          <motion.rect x={310} y={90} width={170} height={18} rx={3}
            fill={`${C.sw}10`} stroke={`${C.sw}30`} strokeWidth={0.5}
            animate={{ opacity: step === 1 ? 0.8 : 0.2 }} />
          <text x={395} y={103} textAnchor="middle" fontSize={10} fill={C.sw}>최소 권한 실행</text>

          {/* Secure Monitor */}
          <motion.rect x={130} y={135} width={280} height={36} rx={7}
            fill={step === 2 ? `${C.mon}14` : `${C.mon}06`}
            stroke={step === 2 ? C.mon : `${C.mon}40`} strokeWidth={step === 2 ? 1.5 : 1}
            animate={{ opacity: step >= 2 ? 1 : 0.35 }} />
          <text x={270} y={158} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mon}>
            Secure Monitor (EL3)
          </text>

          {/* Arrows */}
          <motion.line x1={140} y1={120} x2={220} y2={135}
            stroke={step === 2 ? C.mon : 'var(--border)'} strokeWidth={1.2} strokeDasharray="4,3"
            animate={{ opacity: step === 2 ? 1 : 0.2 }} />
          <motion.line x1={400} y1={120} x2={320} y2={135}
            stroke={step === 2 ? C.mon : 'var(--border)'} strokeWidth={1.2} strokeDasharray="4,3"
            animate={{ opacity: step === 2 ? 1 : 0.2 }} />

          {/* TZASC label */}
          <motion.text x={270} y={185} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
            animate={{ opacity: step === 3 ? 1 : 0.15 }}>
            TZASC — DRAM을 Secure/Non-Secure 영역으로 분리
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
