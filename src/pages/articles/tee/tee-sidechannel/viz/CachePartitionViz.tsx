import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_C0 = '#ef4444';
const C_C1 = '#10b981';
const C_C2 = '#f59e0b';
const C_NEUTRAL = '#6366f1';

const WAYS = 20;

const STEPS = [
  {
    label: 'Intel CAT — LLC를 way 단위로 파티셔닝',
    body: '20-way LLC 가정. COS(Class of Service) 단위로 way 할당.\nMSR로 동적 설정 → 공격자/victim이 다른 way 사용.',
  },
  {
    label: 'COS 할당 — 공격자는 way 0~7, victim은 way 8~15',
    body: 'IA32_L3_MASK_0 = 0x00FF, IA32_L3_MASK_1 = 0xFF00.\nIA32_PQR_ASSOC로 프로세스를 COS에 binding.',
  },
  {
    label: 'Prime+Probe 차단 — LLC 공유 영역 없음',
    body: '공격자가 자기 way만 점유 → victim의 way 측정 불가.\nNoisy neighbor 문제도 동시 완화.',
  },
  {
    label: '한계 — SMT, L1/L2, Intel 전용',
    body: '같은 core 내부 SMT 공격은 막지 못함.\nL1/L2는 core-private이라 파티션 불가. AMD는 부분 지원.',
  },
];

function CacheBar({ ranges }: { ranges: { from: number; to: number; color: string; label?: string }[] }) {
  return (
    <g>
      {Array.from({ length: WAYS }).map((_, i) => {
        const x = 40 + i * 21;
        const range = ranges.find((r) => i >= r.from && i <= r.to);
        const color = range?.color || 'var(--border)';
        return (
          <motion.rect key={i} x={x} y={20} width={18} height={50} rx={3}
            initial={{ opacity: 0 }} animate={{ opacity: range ? 0.85 : 0.25 }}
            transition={{ delay: i * 0.025 }} fill={color} />
        );
      })}
      <text x={240} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        20-way LLC
      </text>
    </g>
  );
}

export default function CachePartitionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <CacheBar ranges={[
                { from: 0, to: 7, color: C_C0, label: 'COS0' },
                { from: 8, to: 15, color: C_C1, label: 'COS1' },
                { from: 16, to: 19, color: C_C2, label: 'COS2' },
              ]} />
              <text x={120} y={120} textAnchor="middle" fontSize={9.5} fill={C_C0}>COS 0 (8 ways)</text>
              <text x={290} y={120} textAnchor="middle" fontSize={9.5} fill={C_C1}>COS 1 (8 ways)</text>
              <text x={420} y={120} textAnchor="middle" fontSize={9.5} fill={C_C2}>COS 2 (4)</text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C_NEUTRAL}>
                MSR로 동적 설정 (root 권한 필요)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <CacheBar ranges={[
                { from: 0, to: 7, color: C_C0 },
                { from: 8, to: 15, color: C_C1 },
              ]} />
              <ModuleBox x={40} y={120} w={170} h={42} label="공격자 VM" sub="COS 0 (way 0~7)" color={C_C0} />
              <ModuleBox x={270} y={120} w={170} h={42} label="Victim VM" sub="COS 1 (way 8~15)" color={C_C1} />
              <DataBox x={120} y={180} w={240} h={26} label="IA32_PQR_ASSOC = COS_id" color={C_NEUTRAL} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <CacheBar ranges={[
                { from: 0, to: 7, color: C_C0 },
                { from: 8, to: 15, color: C_C1 },
              ]} />
              <AlertBox x={40} y={108} w={170} h={32} label="Prime+Probe 시도" color={C_C0} />
              <text x={240} y={128} textAnchor="middle" fontSize={9} fill={C_C1}>way 8~15 측정 불가</text>
              <DataBox x={250} y={108} w={190} h={32} label="공유 영역 없음" color={C_C1} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_C1}>
                LLC 기반 사이드채널 차단
              </text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Noisy neighbor 문제도 함께 해결
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_C0}>
                CAT 한계
              </text>
              {[
                'SMT 공격: 같은 core 내부 → 우회 가능',
                'L1/L2: core-private → 파티션 불가',
                'way 수 제한 (보통 16~20)',
                'Intel only (Xeon), AMD 부분 지원',
                'SGX enclave 단위 세분화 어려움',
              ].map((line, i) => (
                <motion.text key={i} x={50} y={50 + i * 28} fontSize={9.5} fill={C_C0}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 50 }} transition={{ delay: i * 0.06 }}>
                  ✗ {line}
                </motion.text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
