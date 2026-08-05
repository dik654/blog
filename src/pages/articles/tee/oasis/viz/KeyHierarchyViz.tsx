import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'L0: Master Secret — KM enclave 내부', body: 'EGETKEY 로 SGX-unique sealing 키 획득.\n에포크 경계마다 회전, 이전 마스터로 새 마스터 파생.' },
  { label: 'L1: Runtime Root Key — ParaTime 별', body: 'HKDF(master, "runtime:" || R.ID).\n각 ParaTime(Sapphire/Cipher/...) 마다 독립.' },
  { label: 'L2: Contract Key — 컨트랙트 별', body: 'HKDF(runtime_root, "contract:" || addr).\n컨트랙트 단위 격리 — 한 컨트랙트 키 유출이 다른 컨트랙트에 전파 안 됨.' },
  { label: 'L3: Slot Encryption Key — 슬롯 별', body: 'HKDF(contract_key, "slot:" || index).\nstorage slot 마다 독립 키 → rainbow table 공격 무력.' },
];

const LEVELS = [
  { y: 25,  label: 'Master Secret',     sub: 'EGETKEY · sealed', color: '#a855f7' },
  { y: 80,  label: 'Runtime Root Key',  sub: 'HKDF "runtime:R"', color: '#3b82f6' },
  { y: 135, label: 'Contract Key',      sub: 'HKDF "contract:C"', color: '#10b981' },
  { y: 190, label: 'Slot Key',          sub: 'HKDF "slot:S"',     color: '#f59e0b' },
];

export default function KeyHierarchyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LEVELS.map((l, i) => {
            const active = step === i;
            const lit = step >= i;
            return (
              <g key={l.label}>
                <motion.g animate={{ opacity: active ? 1 : lit ? 0.7 : 0.3 }}>
                  <ModuleBox x={140} y={l.y} w={200} h={42}
                    label={l.label} sub={l.sub} color={l.color} />
                </motion.g>
                {/* connector + HKDF arrow */}
                {i > 0 && (
                  <motion.g animate={{ opacity: lit ? 1 : 0.2 }}>
                    <motion.line x1={240} y1={LEVELS[i - 1].y + 42} x2={240} y2={l.y}
                      stroke={l.color} strokeWidth={1.2}
                      initial={{ pathLength: 0 }} animate={{ pathLength: lit ? 1 : 0 }}
                      transition={{ duration: 0.4 }} />
                    <DataBox x={350} y={l.y - 9} w={70} h={20}
                      label="HKDF" color={l.color} outlined={active} />
                  </motion.g>
                )}
                {/* level label on left */}
                <text x={120} y={l.y + 27} textAnchor="end" fontSize={9}
                  fontWeight={700} fill={active ? l.color : 'var(--muted-foreground)'}>
                  L{i}
                </text>
              </g>
            );
          })}

          {/* Step 3 — security insight */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <text x={240} y={235} textAnchor="middle" fontSize={9}
                fill="#f59e0b" fontWeight={600}>
                slot 별 독립 키 → 결정적 파생 + 격리
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
