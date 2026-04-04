import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'User-space TA: ELF 바이너리, S.EL0 최소 권한 실행',
  'Pseudo TA: OP-TEE 커널(S.EL1) 내부에 정적 링크',
  'Secure Partition (FF-A): ARMv8.4+ 격리 파티션',
];

const TYPES = [
  { label: 'User-space TA', level: 'S.EL0', desc: 'ELF, /lib/optee_armtz/<uuid>.ta', color: '#6366f1' },
  { label: 'Pseudo TA', level: 'S.EL1', desc: 'core/pta/ 정적 링크', color: '#10b981' },
  { label: 'Secure Partition', level: 'S.EL0/1', desc: 'FF-A (ARMv8.4+)', color: '#f59e0b' },
];

export default function TATypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {TYPES.map((t, i) => {
            const active = i === step;
            const y = 15 + i * 48;
            return (
              <g key={t.label}>
                <motion.rect x={30} y={y} width={480} height={40} rx={7}
                  fill={active ? `${t.color}14` : `${t.color}05`}
                  stroke={active ? t.color : `${t.color}30`}
                  strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : 0.3 }} transition={{ duration: 0.3 }} />
                <text x={50} y={y + 17} fontSize={11} fontWeight={700} fill={t.color}>{t.label}</text>
                <motion.rect x={200} y={y + 6} width={60} height={16} rx={3}
                  fill={`${t.color}15`} stroke={`${t.color}50`} strokeWidth={0.5} />
                <text x={230} y={y + 18} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={t.color}>{t.level}</text>
                <text x={275} y={y + 18} fontSize={10} fill="var(--muted-foreground)">{t.desc}</text>
                {active && (
                  <motion.circle cx={20} cy={y + 20} r={4} fill={t.color}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} />
                )}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
