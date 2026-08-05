import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_USER = '#6366f1';
const C_KERN = '#ef4444';
const C_FIX = '#10b981';
const C_CACHE = '#f59e0b';

const STEPS = [
  {
    label: 'CPU 버그 — page fault는 retirement 시점에 체크',
    body: '투기 실행 중에는 권한이 무시되고 kernel address가 로드된다.\n로드된 byte가 다음 명령에서 사용되며 캐시에 흔적을 남긴다.',
  },
  {
    label: '공격 — try { b = *kernel; array[b * 4096]; } catch PageFault',
    body: 'kernel byte를 투기적으로 읽고 array에 dependent access.\nPage fault는 정상적으로 catch되지만 캐시는 이미 오염됨.',
  },
  {
    label: 'Measure → kernel byte 복원 (~500 KB/s)',
    body: 'Flush+Reload로 array의 어느 인덱스가 hit인지 측정 → kernel byte 값.\n반복 → 사용자 모드에서 전체 커널 메모리 dump.',
  },
  {
    label: '완화 — KPTI (Kernel Page Table Isolation)',
    body: '사용자 모드에서 kernel VA를 매핑하지 않음.\n투기 접근조차 불가 → Meltdown 차단. 단, syscall당 ~5% 성능 비용.',
  },
];

export default function MeltdownViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={30} w={170} h={36} label="투기 실행 단계" sub="권한 무시" color={C_USER} />
              <ActionBox x={250} y={30} w={170} h={36} label="Retirement 단계" sub="권한 체크 (너무 늦음)" color={C_KERN} />
              <DataBox x={140} y={100} w={200} h={32} label="kernel byte 로드 (투기)" color={C_KERN} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_KERN}>
                투기 실행이 권한보다 먼저 → 데이터 누출 통로
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <AlertBox x={40} y={20} w={400} h={32} label="b = *(char*)kernel_address" color={C_KERN} />
              <ActionBox x={40} y={60} w={400} h={32} label="array[b * 4096] (dependent access)" color={C_USER} />
              <text x={240} y={114} textAnchor="middle" fontSize={9} fill={C_USER}>
                except PageFault: pass (정상 흐름)
              </text>
              <DataBox x={120} y={130} w={240} h={32} label="cache: array[b * 4096] hot" color={C_CACHE} outlined />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill={C_KERN}>
                page fault는 정상적으로 처리, but 캐시 흔적 남음
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={32} label="for k in 0..256: time = rdtscp(&array[k * 4096])" color={C_USER} />
              {Array.from({ length: 32 }).map((_, i) => {
                const x = 40 + i * 13;
                const hot = i === 17;
                return (
                  <motion.rect key={i} x={x} y={70} width={10} height={32} rx={2}
                    initial={{ opacity: 0 }} animate={{ opacity: hot ? 1 : 0.4 }} transition={{ delay: i * 0.03 }}
                    fill={hot ? C_KERN : C_USER} />
                );
              })}
              <DataBox x={140} y={120} w={200} h={28} label={`b = 17 → kernel byte`} color={C_KERN} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C_KERN}>
                ~500 KB/s 속도로 전체 커널 메모리 dump 가능
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={30} w={170} h={32} label="User page table" color={C_USER} outlined />
              <DataBox x={250} y={30} w={170} h={32} label="Kernel page table" color={C_KERN} outlined />
              <line x1={210} y1={46} x2={250} y2={46} stroke={C_FIX} strokeWidth={1} strokeDasharray="4 3" />
              <text x={230} y={42} textAnchor="middle" fontSize={9} fill={C_FIX}>분리</text>
              <ActionBox x={120} y={90} w={240} h={32} label="user mode → kernel VA 미매핑" color={C_FIX} />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_FIX}>
                투기 접근조차 불가 → Meltdown 차단
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                비용: syscall당 ~5% 성능 hit
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
