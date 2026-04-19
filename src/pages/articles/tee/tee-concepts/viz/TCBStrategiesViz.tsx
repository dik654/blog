import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '전략 1: 라이브러리 최소화 — minimal runtime, 필요 기능만 링크' },
  { label: '전략 2: Partitioning — 민감 로직만 enclave (Edgeless, Asylo)' },
  { label: '전략 3: Formal Verification — seL4, Hacl*, FStar/Coq 사용' },
  { label: '전략 4: Hardware-rooted — Root key는 CPU 내부, attestation으로 검증' },
  { label: '전략 5: Defense in depth — TCB 안에서도 mini-TCB로 구조화' },
  { label: '현실 적용 — Apple SEPOS, Google Titan, Microsoft VBS 사례' },
];

const STRATEGIES: { color: string; title: string; details: string[] }[] = [
  {
    color: '#6366f1',
    title: '라이브러리 최소화',
    details: [
      '표준 libc 대신 minimal runtime (Intel SGX-SDK)',
      '필요한 기능만 링크',
      '미사용 코드 제거 (--gc-sections)',
    ],
  },
  {
    color: '#10b981',
    title: 'Partitioning',
    details: [
      '민감 로직만 enclave에 (Edgeless, Asylo)',
      '나머지는 untrusted world',
      'ECall/OCall로 경계 관리',
    ],
  },
  {
    color: '#f59e0b',
    title: 'Formal Verification',
    details: [
      'seL4 microkernel (검증된 커널)',
      'Hacl* (검증된 암호 라이브러리)',
      'FStar, Coq 등 증명 도구',
    ],
  },
  {
    color: '#0ea5e9',
    title: 'Hardware-rooted',
    details: [
      'Root key는 CPU 내부 (software 배제)',
      '물리 공격만 root 훼손 가능',
      'Attestation으로 TCB 상태 검증',
    ],
  },
  {
    color: '#a855f7',
    title: 'Defense in depth',
    details: [
      'TCB 내부도 mini-TCB으로 구조화',
      '예: SGX 안에서 Intel MPX로 추가 격리',
      'One bug ≠ full compromise',
    ],
  },
];

const REAL_WORLD = [
  { name: 'Apple Secure Enclave', sub: '~100K LoC (custom silicon + SEPOS)', c: '#10b981' },
  { name: 'Google Titan', sub: '~10K LoC (전용 RISC-V)', c: '#10b981' },
  { name: 'Microsoft VBS', sub: 'Hyper-V 기반 (큰 TCB 감수)', c: '#f59e0b' },
];

export default function TCBStrategiesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 5 && (() => {
            const s = STRATEGIES[step];
            return (<g>
              <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={s.color}>
                전략 {step + 1}: {s.title}
              </text>
              {s.details.map((d, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <rect x={40} y={50 + i * 50} width={440} height={36} rx={5}
                    fill={`${s.color}10`} stroke={`${s.color}50`} strokeWidth={0.8} />
                  <rect x={40} y={50 + i * 50} width={4} height={36} fill={s.color} />
                  <text x={60} y={72 + i * 50} fontSize={11}
                    fill="var(--foreground)">{d}</text>
                </motion.g>
              ))}
            </g>);
          })()}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              실세계 적용 사례
            </text>
            {REAL_WORLD.map((r, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50} y={50 + i * 56} w={420} h={44}
                  label={r.name} sub={r.sub} color={r.c} />
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
