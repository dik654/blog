import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const BOOT = [
  { label: 'Secure ROM', color: '#6366f1', pcr: 'PCR[0]' },
  { label: 'BIOS/UEFI', color: '#0ea5e9', pcr: 'PCR[0]' },
  { label: 'Bootloader', color: '#8b5cf6', pcr: 'PCR[4]' },
  { label: 'OS Kernel', color: '#10b981', pcr: 'PCR[5]' },
  { label: 'Application', color: '#f59e0b', pcr: 'PCR[7]' },
];

const STEPS = [
  { label: 'Secure ROM: 변조 불가능한 첫 번째 코드 실행' },
  { label: 'BIOS 측정: SHA-256(BIOS) → PCR[0] extend' },
  { label: 'Bootloader 측정: SHA-256(GRUB) → PCR[4] extend' },
  { label: 'Kernel 측정: SHA-256(vmlinuz) → PCR[5] extend' },
  { label: 'App 시작: 전체 신뢰 체인 완성' },
];
const BODY = [
  '제조 시 CPU에 고정된 최초 코드',
  '펌웨어 해시를 TPM에 기록',
  '부트로더 무결성 측정',
  '커널 바이너리 해시 기록',
  'PCR 값으로 원격 증명 가능',
];
const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

export default function SecureBootViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* Boot chain */}
          {BOOT.map((b, i) => {
            const active = i === step;
            const done = i < step;
            const cx = 30 + i * 90;
            return (
              <g key={i}>
                {i > 0 && (
                  <motion.line x1={cx - 18} y1={40} x2={cx} y2={40}
                    stroke={done || active ? b.color : 'var(--border)'}
                    strokeWidth={done || active ? 1.5 : 0.8}
                    animate={{ opacity: done || active ? 0.8 : 0.2 }} transition={sp} />
                )}
                <motion.rect x={cx} y={20} width={72} height={40} rx={6}
                  animate={{
                    fill: `${b.color}${active ? '22' : '08'}`,
                    stroke: b.color, strokeWidth: active ? 2 : 0.8,
                    opacity: done ? 0.5 : active ? 1 : 0.2,
                  }} transition={sp} />
                <text x={cx + 36} y={38} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={b.color}>{b.label}</text>
                <text x={cx + 36} y={50} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{b.pcr}</text>
              </g>
            );
          })}

          {/* Animated measurement ball */}
          <motion.circle r={5} fill={BOOT[step].color}
            animate={{ cx: 30 + step * 90 + 36, cy: 40 }}
            transition={{ type: 'spring', bounce: 0.25 }}
            style={{ filter: `drop-shadow(0 0 4px ${BOOT[step].color}88)` }} />

          {/* TPM PCR bar */}
          <rect x={30} y={80} width={420} height={24} rx={5}
            fill="#10b98106" stroke="#10b981" strokeWidth={0.8} />
          <text x={40} y={96} fontSize={10} fontWeight={600} fill="var(--foreground)">TPM PCR</text>
          <motion.rect x={30} y={80} width={420} height={24} rx={5}
            fill="#10b98115" initial={{ scaleX: 0 }}
            animate={{ scaleX: (step + 1) / BOOT.length }}
            style={{ transformOrigin: 'left', transformBox: 'fill-box' }}
            transition={{ duration: 0.5, type: 'spring' }} />
          <motion.text x={30 + 420 * ((step + 1) / BOOT.length) - 8} y={96}
            textAnchor="end" fontSize={10} fontWeight={600} fill="#10b981"
            animate={{ x: 30 + 420 * ((step + 1) / BOOT.length) - 8 }}
            transition={{ duration: 0.5 }}>
            extend {Math.round((step + 1) / BOOT.length * 100)}%
          </motion.text>

          <motion.text x={30} y={125} fontSize={10} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
