import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_TAG = '#6366f1';
const C_SET = '#f59e0b';
const C_BYTE = '#10b981';
const C_HUGE = '#ef4444';

const STEPS = [
  {
    label: 'LLC physical address 분해',
    body: '32MB / 16-way / 64B line 가정.\n[31:17] tag, [16:6] set (11 bits = 2048 sets), [5:0] byte.',
  },
  {
    label: '같은 set 매핑 — VA 일부로 식별',
    body: '같은 set에 매핑되려면 PA[16:6]이 동일.\n4KB page 가정 시 VA[11:6]만 알면 set 후보 식별 가능.',
  },
  {
    label: 'Huge page (2MB) → VA만으로 eviction set 구성',
    body: 'VA·PA 하위 21-bit 일치. 공격자가 VA만 알면 같은 cache set 주소 N개 즉시 모음.\n일반 4KB page는 probing(Liu et al. 2015)으로 검색.',
  },
];

export default function EvictionSetViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="var(--foreground)">
                Physical Address (32-bit 예시)
              </text>
              <rect x={40} y={36} width={200} height={32} rx={3} fill={`${C_TAG}20`} stroke={C_TAG} />
              <text x={140} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_TAG}>tag</text>
              <text x={140} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[31:17]</text>

              <rect x={240} y={36} width={160} height={32} rx={3} fill={`${C_SET}20`} stroke={C_SET} />
              <text x={320} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_SET}>set</text>
              <text x={320} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[16:6] = 11 bits</text>

              <rect x={400} y={36} width={40} height={32} rx={3} fill={`${C_BYTE}20`} stroke={C_BYTE} />
              <text x={420} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_BYTE}>byte</text>
              <text x={420} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[5:0]</text>

              <DataBox x={130} y={100} w={220} h={28} label="2048 sets × 16 ways × 64B = 2MB/slice" color={C_SET} outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 set에 매핑되려면 PA[16:6]이 동일해야 한다
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="var(--foreground)">
                같은 set 후보 (4KB page)
              </text>
              {[0, 1, 2, 3, 4].map((i) => {
                const x = 40 + i * 86;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <rect x={x} y={36} width={76} height={28} rx={4} fill={`${C_SET}15`} stroke={C_SET} />
                    <text x={x + 38} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_SET}>
                      VA mod 64K
                    </text>
                  </motion.g>
                );
              })}
              <ActionBox x={120} y={90} w={240} h={32} label="VA[11:6] 같은 후보 모음" sub="probing으로 set 확정" color={C_TAG} />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                4KB page → 일부 bit 일치만으로는 부족
              </text>
              <text x={240} y={166} textAnchor="middle" fontSize={9} fill={C_SET}>
                실전: probing 기반 eviction set 탐색
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C_HUGE}>
                Huge page (2MB) — 21-bit 일치
              </text>
              <DataBox x={120} y={36} w={240} h={32} label="VA[20:0] = PA[20:0]" color={C_HUGE} outlined />
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const x = 40 + i * 70;
                return (
                  <motion.rect key={i} x={x} y={84} width={60} height={20} rx={3}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    fill={`${C_HUGE}25`} stroke={C_HUGE} />
                );
              })}
              <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_HUGE}>
                VA만으로 eviction set 즉시 구성
              </text>
              <text x={240} y={156} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                실무: huge page 사용 시 공격이 훨씬 쉬워짐
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
