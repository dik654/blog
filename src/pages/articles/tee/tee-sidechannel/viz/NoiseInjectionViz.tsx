import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_REAL = '#6366f1';
const C_DUMMY = '#f59e0b';
const C_LIM = '#ef4444';

const STEPS = [
  {
    label: 'Dummy operations — 랜덤 nop + dummy access',
    body: 'real_operation 후 random_delay 만큼 nop 삽입.\n랜덤 메모리 접근(dummy_accesses)으로 cache 흔적 노이즈화.',
  },
  {
    label: 'Timing randomization — TSC 측정 교란',
    body: 'TSX·random delay·cache pre-warming.\n공격자가 타이밍 측정 정밀도를 잃게 만든다.',
  },
  {
    label: '한계 — 통계적 공격은 여전히 가능',
    body: '노이즈 평균은 측정으로 제거 가능. 완전 방어 아닌 raising the bar.\n성능 오버헤드 실재 — 실시간 워크로드에서는 부담.',
  },
  {
    label: '실전 사용처 — Tor / SGX quote / 결제 카드',
    body: 'Tor relay: timing 난독화로 트래픽 분석 방해.\nSGX quote: random delay 삽입. 결제 카드: 랜덤 SPA/DPA 대응.',
  },
];

export default function NoiseInjectionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={32} label="real_operation(key)" color={C_REAL} />
              <ActionBox x={40} y={64} w={400} h={32} label="for i in 0..random_delay(): nop" color={C_DUMMY} />
              <ActionBox x={40} y={108} w={400} h={32} label="dummy_accesses(random_pattern())" color={C_DUMMY} />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill={C_DUMMY}>
                cache 흔적이 noise로 가려짐
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_REAL}>
                실제 실행 시간 (RDTSC)
              </text>
              {[120, 130, 140, 125, 135, 128, 142].map((v, i) => {
                const x = 40 + i * 60;
                return (
                  <motion.rect key={i} x={x} y={40} width={50} height={v / 2} rx={2}
                    initial={{ height: 0 }} animate={{ height: v / 2 }} transition={{ delay: i * 0.07 }}
                    fill={C_REAL} opacity={0.85} />
                );
              })}
              <text x={240} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                + dummy delay → 측정 변동성 ↑
              </text>
              <DataBox x={120} y={156} w={240} h={28} label="공격자 SNR 감소" color={C_DUMMY} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <AlertBox x={40} y={20} w={400} h={32} label="평균을 취하면 노이즈 제거됨" color={C_LIM} />
              {[
                '통계적 공격: 충분한 trace 수집 → 정확도 회복',
                '성능 오버헤드: 실시간 워크로드 부담',
                '완전 방어 아닌 "raising the bar"',
              ].map((line, i) => (
                <motion.text key={i} x={50} y={70 + i * 32} fontSize={9.5} fill={C_LIM}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 50 }} transition={{ delay: i * 0.08 }}>
                  ✗ {line}
                </motion.text>
              ))}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                ['Tor relay', 'timing 난독화'],
                ['SGX quote', 'random delays'],
                ['결제 카드', 'SPA/DPA 대응'],
              ].map(([n, d], i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <DataBox x={40 + i * 145} y={60} w={130} h={36} label={n} sub={d} color={C_REAL} outlined />
                </motion.g>
              ))}
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                보조 방어선으로만 활용 (단일 대책 X)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
