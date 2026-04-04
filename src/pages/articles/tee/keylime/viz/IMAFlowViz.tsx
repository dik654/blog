import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '파일 접근 시점: 커널 IMA 측정' },
  { label: 'PCR 10 확장: 해시값을 TPM에 기록' },
  { label: 'IMA 로그 기록: ascii_runtime_measurements' },
  { label: '런타임 정책 검증: 허용 목록 대조' },
  { label: 'IMA 서명 검증: ima-sig 디지털 서명' },
];

const ANNOT = ['파일 실행/mmap 시 IMA 측정', '해시값 TPM PCR 10 확장', 'IMA 로그 ascii_runtime 기록', '런타임 허용 목록 대조', 'ima-sig 디지털 서명 검증'];
const LAYERS = [
  { label: '파일 시스템', color: '#8b5cf6', y: 20 },
  { label: 'IMA (커널)', color: '#3b82f6', y: 52 },
  { label: 'TPM PCR 10', color: '#10b981', y: 84 },
  { label: 'Keylime 검증', color: '#f59e0b', y: 116 },
];

export default function IMAFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = (step === 0 && i <= 1) || (step === 1 && i === 2) ||
              (step === 2 && i <= 2) || (step >= 3 && i === 3);
            return (
              <g key={l.label}>
                <motion.rect x={40} y={l.y} width={280} height={26} rx={6}
                  fill={active ? `${l.color}20` : `${l.color}08`}
                  stroke={active ? l.color : `${l.color}30`}
                  strokeWidth={active ? 2 : 1}
                  animate={{ opacity: active ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }} />
                <text x={55} y={l.y + 17} fontSize={10} fontWeight={600}
                  fill={active ? l.color : 'var(--muted-foreground)'}>
                  {l.label}
                </text>
              </g>
            );
          })}
          {/* Moving hash packet */}
          <motion.circle r={7} fill={LAYERS[Math.min(step, 3)].color}
            animate={{
              cx: step < 3 ? 300 : 180,
              cy: LAYERS[Math.min(step, 3)].y + 13,
            }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
          <motion.text
            animate={{
              x: step < 3 ? 300 : 180,
              y: LAYERS[Math.min(step, 3)].y + 16,
            }}
            textAnchor="middle" fontSize={10} fontWeight={600} fill="white"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}>
            H
          </motion.text>
                  <motion.text x={365} y={75} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
