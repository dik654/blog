import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_TRAIN = '#10b981';
const C_ATK = '#ef4444';
const C_MEAS = '#6366f1';
const C_CACHE = '#f59e0b';

const STEPS = [
  {
    label: '훈련 — branch predictor를 “true”로 학습',
    body: '여러 번 in-bounds x를 사용 → CPU가 if (x < array1_size)가 항상 true라고 예측한다.\n이후 잘못된 예측이라도 투기 실행이 진행된다.',
  },
  {
    label: '공격 — out-of-bounds x로 비밀 byte 로드',
    body: 'x = SECRET_OFFSET. CPU가 predictor 믿고 array1[x] 투기 로드 (권한 체크 전).\nb = secret_byte → array2[b * 4096] 투기 접근 → 캐시에 흔적.',
  },
  {
    label: 'Rollback — 권한 체크 실패, 하지만 캐시 흔적은 남음',
    body: 'CPU가 잘못된 분기를 retire 시점에 rollback.\n그러나 캐시 상태는 되돌리지 않으므로 array2[b * 4096] line이 캐시에 남아있다.',
  },
  {
    label: 'Measure — Flush+Reload로 어떤 line이 hit인지 측정',
    body: 'array2의 256개 line을 모두 측정 → 빠른 line의 인덱스 b가 비밀 byte.\n바이트 단위로 반복 → 임의 메모리 dump.',
  },
];

export default function SpectreV1Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={32} label="for j in 1..10: x = j % size; if (x < size) ..." color={C_TRAIN} />
              <DataBox x={40} y={70} w={180} h={36} label="branch predictor" color={C_TRAIN} outlined />
              <text x={250} y={92} fontSize={9} fill="var(--muted-foreground)">→ "true" 학습 완료</text>
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill={C_TRAIN}>
                CPU: "이 분기는 항상 true다" 라고 확신
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <AlertBox x={40} y={20} w={400} h={32} label="x = SECRET_OFFSET (out-of-bounds)" color={C_ATK} />
              <ActionBox x={40} y={64} w={180} h={32} label="if (x < size) → 투기 true" color={C_ATK} />
              <ActionBox x={40} y={104} w={180} h={32} label="b = array1[SECRET]" color={C_ATK} />
              <ActionBox x={40} y={144} w={180} h={32} label="array2[b * 4096]" color={C_ATK} />
              <line x1={220} y1={120} x2={260} y2={156} stroke={C_ATK} strokeWidth={0.7} markerEnd="url(#arrR)" />
              <DataBox x={260} y={140} w={170} h={32} label={`cache line b 진입`} color={C_CACHE} outlined />
              <defs>
                <marker id="arrR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill={C_ATK} />
                </marker>
              </defs>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill={C_ATK}>
                투기 실행이 비밀 byte를 cache에 누설
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={30} w={400} h={32} label="권한 체크 실패 → 분기 결과 rollback" color={C_ATK} />
              <DataBox x={40} y={80} w={200} h={32} label="register state: 복원" color={C_TRAIN} outlined />
              <DataBox x={250} y={80} w={190} h={32} label="cache state: 그대로" color={C_CACHE} outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_ATK}>
                CPU 버그: 캐시 상태는 rollback 대상 아님
              </text>
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                → 비밀 byte의 흔적이 micro-arch에 남음
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={32} label="for k in 0..256: time = rdtscp(&array2[k * 4096])" color={C_MEAS} />
              {Array.from({ length: 24 }).map((_, i) => {
                const x = 40 + i * 17;
                const isHot = i === 12;
                return (
                  <motion.rect key={i} x={x} y={70} width={14} height={28} rx={2}
                    initial={{ opacity: 0 }} animate={{ opacity: isHot ? 1 : 0.4 }} transition={{ delay: i * 0.03 }}
                    fill={isHot ? C_ATK : C_MEAS} />
                );
              })}
              <DataBox x={140} y={120} w={200} h={28} label={`b = 12 → secret byte`} color={C_ATK} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C_ATK}>
                바이트 단위 반복 → 임의 메모리 dump (~500KB/s)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
