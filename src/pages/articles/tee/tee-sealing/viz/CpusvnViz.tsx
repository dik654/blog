import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_T1 = '#6366f1';
const C_T2 = '#10b981';
const C_DOWN = '#f59e0b';
const C_BAD = '#ef4444';

const STEPS = [
  {
    label: 'CPUSVN — CPU의 Security Version Number',
    body: '16-byte vector. microcode·TCB 업데이트 시 증가.\n과거 CPUSVN으로 키 파생 가능 (downgrade 허용 정책).',
  },
  {
    label: 'T1 → T2 시나리오 — microcode 업데이트',
    body: 'T1: CPUSVN = 5에서 sealing.\nT2: microcode 패치 → CPUSVN = 6. T2에서 unseal 시도.',
  },
  {
    label: 'KEYREQUEST.cpusvn 정책 선택',
    body: 'A) 현재 CPUSVN: TCB 업데이트 시 모든 sealed 재암호화 필요 (가장 엄격).\nB) sealed에 저장된 CPUSVN 사용: 유연, old data 복구 가능 (일반적 선택).',
  },
];

export default function CpusvnViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={130} y={20} w={220} h={36} label="CPUSVN (16B vector)" color={C_T1} outlined />
              {[5, 6, 7, 8, 9].map((v, i) => {
                const x = 60 + i * 70;
                const isPast = v < 9;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
                    <DataBox x={x} y={80} w={60} h={32} label={`v=${v}`} color={isPast ? C_T1 : C_T2} outlined />
                  </motion.g>
                );
              })}
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill={C_DOWN}>
                과거 CPUSVN으로 키 파생 가능 (downgrade)
              </text>
              <text x={240} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                microcode·TCB 업데이트 시 단조 증가
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={30} w={195} h={36} label="T1: CPUSVN_T1 = 5" sub="sealing" color={C_T1} outlined />
              <DataBox x={245} y={30} w={195} h={36} label="T2: CPUSVN_T2 = 6" sub="microcode 업데이트 후" color={C_T2} outlined />
              <ActionBox x={40} y={86} w={400} h={32} label="T2: req.cpusvn = {5, 0, ...} (저장된 값)" color={C_DOWN} />
              <DataBox x={130} y={134} w={220} h={32} label="EGETKEY → key_for_T1 → unseal OK" color={C_T2} outlined />
              <text x={240} y={196} textAnchor="middle" fontSize={9} fill={C_DOWN}>
                과거 데이터 복구 가능
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={400} h={32} label="A) 현재 CPUSVN 사용" color={C_BAD} outlined />
              <text x={50} y={70} fontSize={9} fill={C_BAD}>✗ TCB 업데이트 시 전체 sealed 재암호화 필요</text>
              <text x={50} y={86} fontSize={9} fill={C_T1}>✓ 가장 엄격 — old data 자동 무효화</text>
              <DataBox x={40} y={108} w={400} h={32} label="B) sealed에 CPUSVN 저장 + 해당 값 사용" color={C_T2} outlined />
              <text x={50} y={158} fontSize={9} fill={C_T2}>✓ 유연 — old data 복구 가능 (일반적 선택)</text>
              <text x={50} y={174} fontSize={9} fill={C_DOWN}>⚠ TCB 패치 전 키로 파생 정책 별도 결정</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
