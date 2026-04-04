import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'OpenSession: CA가 TA UUID로 세션 열기' },
  { label: 'InvokeCommand: SMC를 통한 TA 명령 실행' },
  { label: 'CloseSession: 세션 핸들 및 리소스 해제' },
];
const ANNOT = ['TEEC_OpenSession → TA 로드', 'SMC_CALL → TA 디스패치', 'CloseSession → 리소스 해제'];

const LAYERS = [
  { label: 'CA (EL0)', color: '#6366f1' },
  { label: 'libteec (EL1)', color: '#0ea5e9' },
  { label: 'OP-TEE (S.EL1)', color: '#10b981' },
  { label: 'TA (S.EL0)', color: '#f59e0b' },
];

const PHASE_CLR = ['#6366f1', '#10b981', '#f59e0b'];

export default function TASessionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Layer stack */}
          {LAYERS.map((l, i) => {
            const y = 20 + i * 45;
            const indent = i * 20;
            return (
              <g key={l.label}>
                <motion.rect x={30 + indent} y={y} width={300 - indent * 2} height={34} rx={6}
                  fill={`${l.color}10`} stroke={l.color} strokeWidth={1}
                  animate={{ strokeWidth: 1, opacity: 0.8 }}
                  transition={{ duration: 0.3 }} />
                <text x={40 + indent} y={y + 14} fontSize={10} fontWeight={600} fill={l.color}>{l.label}</text>
                <text x={40 + indent} y={y + 26} fontSize={10} fill="var(--muted-foreground)">
                  {['TEEC_*Session()', 'ioctl / SMC', 'tee_ta_*_session()', 'TA_*EntryPoint()'][i]}
                </text>
                {/* connector */}
                {i > 0 && (
                  <line x1={180} y1={y - 11} x2={180} y2={y}
                    stroke="var(--border)" strokeWidth={1} strokeDasharray="2,2" />
                )}
              </g>
            );
          })}
          {/* Moving signal ball */}
          <motion.circle r={7} fill={PHASE_CLR[step]}
            animate={{ cy: [20 + 17, 65 + 17, 110 + 17, 155 + 17, 110 + 17, 65 + 17, 20 + 17] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} cx={180} />
          {/* Phase label */}
          <motion.text x={190} y={195} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={PHASE_CLR[step]} key={step}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {['OpenSession', 'InvokeCommand', 'CloseSession'][step]}
          </motion.text>
          <motion.text x={385} y={100} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
