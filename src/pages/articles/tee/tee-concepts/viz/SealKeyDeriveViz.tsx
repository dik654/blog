import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Seal Key 파생 — 결정적 (deterministic), 같은 input → 같은 output' },
  { label: 'AES-CMAC 입력 요소 — root key + 코드 measurement + 정책 + keyid' },
  { label: '같은 enclave 다시 실행 — root + measurement 동일 → 같은 SealKey' },
  { label: '다른 enclave / 다른 CPU — root 또는 measurement 변경 → 복호화 실패' },
];

const CMAC_INPUTS = [
  { name: 'RootSealKey', sub: 'CPU eFuse 고유', c: '#ef4444' },
  { name: 'keyname', sub: 'Seal vs Report 구분', c: '#6366f1' },
  { name: 'isvprodid + isvsvn', sub: 'enclave 버전', c: '#10b981' },
  { name: 'ownerepoch', sub: 'CPU 이력 식별', c: '#f59e0b' },
  { name: 'attributes + miscselect', sub: 'enclave 모드', c: '#0ea5e9' },
  { name: 'measurement', sub: 'MRENCLAVE / MRSIGNER', c: '#a855f7' },
  { name: 'configid + configsvn', sub: '추가 정책', c: '#6366f1' },
  { name: 'keyid', sub: '랜덤 nonce', c: '#10b981' },
];

const SAME_ENCLAVE = [
  { line: 'RootSealKey 동일 (같은 CPU)', c: '#10b981' },
  { line: 'measurement 동일 (같은 코드)', c: '#10b981' },
  { line: '→ 같은 SealKey 파생 → 복호화 성공', c: '#10b981' },
];

const DIFFERENT = [
  { line: '다른 enclave: measurement 다름 → 다른 SealKey → 복호화 실패', c: '#ef4444' },
  { line: '다른 CPU: RootSealKey 다름 → 완전히 다른 SealKey → 복호화 실패', c: '#ef4444' },
  { line: '결정성 = HW만으로 password 없이 key recovery', c: '#6366f1' },
];

export default function SealKeyDeriveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              결정적 파생 — Same input → Same output
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30} y={70} w={130} h={50}
                label="Input bundle" sub="measurement + keys" color="#6366f1" outlined />
              <text x={175} y={100} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ActionBox x={205} y={70} w={130} h={50}
                label="AES-CMAC" sub="결정적 함수" color="#10b981" />
              <text x={350} y={100} fontSize={20} fill="var(--muted-foreground)">→</text>
              <DataBox x={380} y={70} w={120} h={50}
                label="SealKey" sub="32 bytes" color="#f59e0b" outlined />
            </motion.g>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              매번 호출해도 동일 key — 영속 저장 후 복원 핵심 메커니즘
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              SealKey = AES-CMAC(RootSealKey, ...inputs)
            </text>
            {CMAC_INPUTS.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}>
                <DataBox x={20 + (i % 2) * 245} y={42 + Math.floor(i / 2) * 42}
                  w={235} h={34} label={c.name} sub={c.sub} color={c.c} outlined />
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              같은 enclave, 같은 CPU → 복호화 성공
            </text>
            {SAME_ENCLAVE.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${s.c}10`} stroke={`${s.c}50`} strokeWidth={0.8} />
                <circle cx={68} cy={68 + i * 50} r={9} fill={s.c} />
                <text x={68} y={72 + i * 50} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="#fff">✓</text>
                <text x={88} y={72 + i * 50} fontSize={11} fontWeight={600} fill={s.c}>{s.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              다른 enclave / 다른 CPU
            </text>
            {DIFFERENT.map((d, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={20} y={50 + i * 50} width={480} height={38} rx={5}
                  fill={`${d.c}10`} stroke={`${d.c}50`} strokeWidth={0.8} />
                <text x={40} y={72 + i * 50} fontSize={10.5} fontWeight={600} fill={d.c}>{d.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
