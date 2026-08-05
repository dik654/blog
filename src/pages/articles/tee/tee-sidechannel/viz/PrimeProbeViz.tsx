import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_PRIME = '#6366f1';
const C_WAIT = '#f59e0b';
const C_PROBE = '#10b981';
const C_VICTIM = '#ef4444';

const SETS = 16;

const STEPS = [
  {
    label: 'PRIME — 공격자가 LLC cache set을 자기 데이터로 채움',
    body: 'LLC associativity(N=16)만큼 같은 set에 매핑되는 주소를 load.\nset 전체가 공격자 eviction_set으로 가득 찬다.',
  },
  {
    label: 'WAIT — Victim(TEE)이 실행되며 cache 접근',
    body: 'Victim이 관심 cache set의 주소를 로드하면 공격자 라인 한 개가 축출된다.\n공격자는 이 시간 동안 가만히 기다린다.',
  },
  {
    label: 'PROBE — eviction_set 재접근, 타이밍 측정',
    body: '빠른 접근(< 40 cycle) → 캐시에 남아있음.\n느린 접근(> 40 cycle) → victim이 밀어냈음 → 메모리 접근 패턴 복원.',
  },
];

export default function PrimeProbeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            LLC cache set (16-way)
          </text>
          {Array.from({ length: SETS }).map((_, i) => {
            const x = 40 + i * 25;
            let fill = 'var(--border)';
            let opacity = 0.3;
            if (step === 0) {
              fill = C_PRIME;
              opacity = 0.85;
            } else if (step === 1) {
              fill = i === 5 ? C_VICTIM : C_PRIME;
              opacity = i === 5 ? 0.9 : 0.5;
            } else if (step === 2) {
              fill = i === 5 ? C_VICTIM : C_PROBE;
              opacity = 0.85;
            }
            return (
              <motion.rect key={i} x={x} y={28} width={20} height={36} rx={3}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity, y: 28 }}
                transition={{ ...sp, delay: i * 0.025 }} fill={fill} />
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={140} y={84} w={200} h={36} label="공격자: 16-way load" sub="eviction_set[0..15] 전부 LLC 진입" color={C_PRIME} />
              <text x={240} y={148} textAnchor="middle" fontSize={9} fill={C_PRIME}>
                set 전체가 공격자 데이터로 가득 참
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                다음 단계: Victim 실행 대기
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={140} y={84} w={200} h={36} label="Victim 실행 (enclave)" sub="관심 set 주소 로드" color={C_VICTIM} />
              <text x={165} y={130} fontSize={9} fill={C_VICTIM}>set #5 → victim 라인 진입</text>
              <line x1={165} y1={64} x2={165} y2={84} stroke={C_VICTIM} strokeWidth={0.8} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                공격자 라인 1개 축출 → 흔적 남음
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={140} y={84} w={200} h={36} label="공격자: 재접근 + RDTSCP" sub="times[0..15] 측정" color={C_PROBE} />
              {Array.from({ length: SETS }).map((_, i) => {
                const x = 40 + i * 25;
                const slow = i === 5;
                return (
                  <text key={i} x={x + 10} y={140} textAnchor="middle" fontSize={7}
                    fill={slow ? C_VICTIM : C_PROBE} fontWeight={slow ? 700 : 400}>
                    {slow ? '250' : '20'}
                  </text>
                );
              })}
              <DataBox x={140} y={158} w={200} h={28} label="set #5 → SLOW = victim accessed" color={C_VICTIM} outlined />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                victim의 메모리 접근 패턴 복원 완료
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
