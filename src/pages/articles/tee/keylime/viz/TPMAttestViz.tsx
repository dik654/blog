import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'EK 인증서 체인 검증' },
  { label: 'MakeCredential: AIK 바인딩' },
  { label: 'ActivateCredential: TPM 소유권 증명' },
  { label: 'TPM Quote: PCR 서명 증명' },
  { label: 'Quote 검증: 서명 + PCR + 클록' },
];

const ANNOT = ['EK 인증서 체인 검증', 'EK 공개키 챌린지 암호화', 'TPM EK 비밀키 복호화 증명', 'AIK PCR 서명 Quote 생성', 'AIK 공개키 서명+PCR 검증'];
const P = [
  { label: 'EK 검증', color: '#ef4444', icon: 'E' },
  { label: 'MakeCred', color: '#f59e0b', icon: 'M' },
  { label: 'Activate', color: '#10b981', icon: 'A' },
  { label: 'Quote', color: '#3b82f6', icon: 'Q' },
  { label: '검증', color: '#6366f1', icon: 'V' },
];

export default function TPMAttestViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <line x1={30} y1={60} x2={370} y2={60} stroke="var(--border)" strokeWidth={1.5} />
          {P.map((s, i) => {
            const cx = 50 + i * 78;
            const active = i === step;
            const done = i < step;
            return (
              <g key={s.label}>
                <motion.circle cx={cx} cy={60} r={20}
                  fill={active ? `${s.color}25` : done ? `${s.color}15` : `${s.color}06`}
                  stroke={active ? s.color : `${s.color}40`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ scale: active ? 1.12 : 1 }}
                  transition={{ duration: 0.3 }} />
                <text x={cx} y={57} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill={active ? s.color : 'var(--muted-foreground)'}>{s.icon}</text>
                <text x={cx} y={68} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{i + 1}</text>
                <text x={cx} y={96} textAnchor="middle" fontSize={7.5} fontWeight={600}
                  fill={active ? s.color : 'var(--muted-foreground)'}>{s.label}</text>
              </g>
            );
          })}
          <motion.g animate={{ x: step * 78 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}>
            <circle cx={50} cy={130} r={9} fill={P[step].color} />
            <text x={50} y={133} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">TPM</text>
          </motion.g>
                  <motion.text x={405} y={80} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
