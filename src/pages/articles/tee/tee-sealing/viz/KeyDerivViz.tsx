import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C1 = '#6366f1';
const C2 = '#10b981';
const C3 = '#f59e0b';

const STEPS = [
  { label: 'Root Seal Key + KDF 입력 파라미터',
    body: 'CPU 칩 제조 시 퓨즈에 주입된 Root Key. 소프트웨어로 추출 불가능.\nKDF 입력: MRENCLAVE/MRSIGNER, ISV_SVN, CPUSVN, KEYID.' },
  { label: 'MRENCLAVE vs MRSIGNER 경로',
    body: 'MRENCLAVE 경로: Root + enclave 바이너리 해시 → Seal Key A.\nMRSIGNER 경로: Root + 서명자 해시 → Seal Key B.\n같은 CPU, 다른 enclave → 다른 키.' },
  { label: '업데이트 시나리오: v1 → v2',
    body: 'MRENCLAVE: 코드 변경 → 해시 변경 → 키 변경. 이전 데이터 접근 불가.\nMRSIGNER: 서명자 동일 → 키 유지. 이전 데이터 접근 가능.' },
];

export default function KeyDerivViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Root Key */}
          <motion.rect x={190} y={8} width={120} height={28} rx={6}
            animate={{ fill: step === 0 ? `${C1}20` : `${C1}10`, stroke: C1,
              strokeWidth: step === 0 ? 1.5 : 0.6 }} transition={sp} />
          <text x={250} y={26} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1}>Root Seal Key</text>

          {/* Arrow down */}
          <line x1={250} y1={36} x2={250} y2={52} stroke={C1} strokeWidth={0.8} />
          <polygon points="246,50 254,50 250,56" fill={C1} />

          {/* KDF box */}
          <motion.rect x={200} y={56} width={100} height={22} rx={4}
            animate={{ fill: step === 0 ? `${C3}20` : `${C3}08`, stroke: C3,
              strokeWidth: step === 0 ? 1.2 : 0.5 }} transition={sp} />
          <text x={250} y={70} textAnchor="middle" fontSize={10} fill={C3}>AES-CMAC KDF</text>

          {/* Params on left of KDF */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['MRENCLAVE', 'ISV_SVN', 'CPUSVN', 'KEYID'].map((p, i) => (
                <text key={p} x={60} y={58 + i * 13} fontSize={10} fill="var(--foreground)" opacity={0.7}>{p}</text>
              ))}
              <line x1={130} y1={67} x2={200} y2={67} stroke={C3} strokeWidth={0.5} strokeDasharray="3,2" />
            </motion.g>
          )}

          {/* Two branches (step >= 1) */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* MRENCLAVE branch */}
              <line x1={230} y1={78} x2={140} y2={108} stroke={C2} strokeWidth={0.8} />
              <rect x={60} y={100} width={160} height={26} rx={5}
                fill={step === 2 ? '#ef444415' : `${C2}15`} stroke={step === 2 ? '#ef4444' : C2} strokeWidth={1} />
              <text x={140} y={117} textAnchor="middle" fontSize={10} fontWeight={500}
                fill={step === 2 ? '#ef4444' : C2}>MRENCLAVE → Key A</text>

              {/* MRSIGNER branch */}
              <line x1={270} y1={78} x2={360} y2={108} stroke={C3} strokeWidth={0.8} />
              <rect x={280} y={100} width={160} height={26} rx={5}
                fill={`${C3}15`} stroke={C3} strokeWidth={1} />
              <text x={360} y={117} textAnchor="middle" fontSize={10} fontWeight={500}
                fill={C3}>MRSIGNER → Key B</text>
            </motion.g>
          )}

          {/* v1→v2 labels (step 2) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={140} y={142} textAnchor="middle" fontSize={10} fill="#ef4444">v1→v2: 키 변경 (접근 불가)</text>
              <text x={360} y={142} textAnchor="middle" fontSize={10} fill={C3}>v1→v2: 키 유지 (접근 가능)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
