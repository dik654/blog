import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ModuleBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '공격 시나리오 — 오래된 sealed_T1.bin을 sealed_T2.bin 자리에 주입' },
  { label: '방법 1: SVN 증가 — sealed_data 안에 monotonic counter, enclave가 최고 SVN 추적' },
  { label: '방법 2: SGX Monotonic Counter — HW 카운터, deprecated (rollback 공격 발견)' },
  { label: '방법 3: 외부 증인 — sealed hash를 blockchain 등 outside source에 저장' },
  { label: '방법 4: Freshness protocol — 주기 challenge-response, 오프라인 제약' },
];

const TIMELINE = [
  { t: 'T1', state: 'balance = 500K', sealed: 'sealed_T1.bin', c: '#6b7280' },
  { t: 'T2', state: 'balance = 400K', sealed: 'sealed_T2.bin', c: '#6b7280' },
  { t: 'T3', state: 'attacker swap', sealed: 'sealed_T1 → 위치 T2', c: '#ef4444' },
  { t: 'T3', state: 'unseal → 500K (실제 400K)', sealed: 'rollback 성공', c: '#ef4444' },
];

const SVN_FIELDS = [
  { line: 'struct sealed_data {', c: '#6366f1' },
  { line: '  uint32_t svn;       // monotonic', c: '#10b981' },
  { line: '  uint8_t ciphertext[];', c: '#10b981' },
  { line: '}; // 낮은 SVN seal은 거부', c: '#f59e0b' },
];

const MC_FIELDS = [
  { line: 'sgx_create_monotonic_counter(&counter)', c: '#6366f1' },
  { line: 'sgx_increment_monotonic_counter(...)', c: '#10b981' },
  { line: 'HW 기반 (wear-leveling flash)', c: '#f59e0b' },
  { line: '⚠ deprecated (rollback 공격 발견)', c: '#ef4444' },
];

const EXT_FIELDS = [
  { line: 'Sealed data hash → blockchain 저장', c: '#6366f1' },
  { line: 'TEE가 unseal 전 최신 hash 확인', c: '#10b981' },
  { line: 'Replay 시도 → hash mismatch 탐지', c: '#ef4444' },
];

const FRESH_FIELDS = [
  { line: '주기적 challenge-response with server', c: '#6366f1' },
  { line: 'Server와 timestamp synchronize', c: '#10b981' },
  { line: '오프라인 모드는 제약 발생', c: '#f59e0b' },
];

export default function RollbackDefenseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              Rollback 공격 시나리오
            </text>
            {TIMELINE.map((t, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={30} y={42 + i * 40} width={460} height={32} rx={4}
                  fill={`${t.c}10`} stroke={`${t.c}50`} strokeWidth={0.8} />
                <text x={55} y={62 + i * 40} fontSize={10.5} fontWeight={700} fill={t.c}>{t.t}</text>
                <text x={100} y={62 + i * 40} fontSize={10} fill="var(--foreground)">{t.state}</text>
                <text x={310} y={62 + i * 40} fontSize={10} fill="var(--muted-foreground)">{t.sealed}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              방법 1: SVN 증가
            </text>
            {SVN_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 38} width={420} height={32} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <text x={70} y={71 + i * 38} fontSize={11} fontWeight={600} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              방법 2: SGX Monotonic Counter
            </text>
            {MC_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={40} y={50 + i * 38} width={440} height={32} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <text x={60} y={71 + i * 38} fontSize={10.5} fontWeight={600} fill={f.c}>{f.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              방법 3: 외부 증인 (witness)
            </text>
            {EXT_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={40} y={50 + i * 50} width={440} height={36} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <rect x={40} y={50 + i * 50} width={4} height={36} fill={f.c} />
                <text x={60} y={72 + i * 50} fontSize={11} fontWeight={600} fill={f.c}>{f.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              방법 4: Freshness protocol
            </text>
            {FRESH_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={40} y={50 + i * 50} width={440} height={36} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <rect x={40} y={50 + i * 50} width={4} height={36} fill={f.c} />
                <text x={60} y={72 + i * 50} fontSize={11} fontWeight={600} fill={f.c}>{f.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
