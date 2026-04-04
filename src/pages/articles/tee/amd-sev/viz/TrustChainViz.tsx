import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'ARK: AMD Root Key - 모든 신뢰의 출발점' },
  { label: 'ASK: AMD SEV Signing Key - 중간 CA' },
  { label: 'VCEK: 칩 고유 키 (펌웨어 버전 포함)' },
  { label: 'PEK -> PDH: 플랫폼 소유자 키 & DH 협상' },
];

const ANNOT = ['AMD 제조 퓨즈 루트 키', 'ARK 서명 AMD 서버 인증서', 'VCEK 칩 고유+FW 버전 키', 'PEK->PDH 플랫폼 DH 협상'];
const CHAIN = [
  { label: 'ARK', sub: 'AMD Root Key', color: '#6366f1' },
  { label: 'ASK', sub: 'SEV Signing Key', color: '#6366f1' },
  { label: 'VCEK', sub: 'Chip Endorsement', color: '#0ea5e9' },
  { label: 'PEK', sub: 'Platform Key', color: '#10b981' },
  { label: 'PDH', sub: 'Diffie-Hellman', color: '#f59e0b' },
];

export default function TrustChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Chain axis */}
          <line x1={190} y1={20} x2={190} y2={210} stroke="var(--border)" strokeWidth={1.5} />

          {CHAIN.map((c, i) => {
            const y = 18 + i * 42;
            const activeStep = i <= 1 ? (i === 0 ? 0 : 1) : i === 2 ? 2 : 3;
            const active = step === activeStep;
            const done = step > activeStep;
            return (
              <g key={c.label}>
                {/* Sign arrow */}
                {i > 0 && (
                  <motion.text x={208} y={y - 4} fontSize={10} fill="var(--muted-foreground)"
                    animate={{ opacity: done || active ? 0.7 : 0.2 }}>
                    서명
                  </motion.text>
                )}
                {/* Node */}
                <motion.rect x={110} y={y} width={160} height={32} rx={7}
                  fill={active ? `${c.color}22` : `${c.color}08`}
                  stroke={active ? c.color : `${c.color}40`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ opacity: done ? 0.4 : active ? 1 : 0.2, scale: active ? 1.04 : 1 }}
                  transition={{ duration: 0.3 }} />
                {/* Num circle */}
                <motion.circle cx={100} cy={y + 16} r={10}
                  fill={done || active ? c.color : 'var(--muted)'}
                  animate={{ opacity: done ? 0.5 : active ? 1 : 0.25 }} />
                <text x={100} y={y + 20} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">{i + 1}</text>
                {/* Text */}
                <text x={125} y={y + 14} fontSize={11} fontWeight={600} fill={active ? c.color : 'var(--foreground)'}>{c.label}</text>
                <text x={125} y={y + 26} fontSize={10} fill="var(--muted-foreground)">{c.sub}</text>
              </g>
            );
          })}

          {/* Moving seal */}
          <motion.g animate={{ y: (step <= 1 ? step : step === 2 ? 2 : 3) * 42 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}>
            <circle cx={290} cy={34} r={8} fill={CHAIN[Math.min(step, 4)].color} />
            <text x={290} y={37} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">SIG</text>
          </motion.g>
                  <motion.text x={385} y={110} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
