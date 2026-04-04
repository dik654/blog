import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { ok: '#10b981', bad: '#ef4444', hi: '#6366f1' };

const STEPS = [
  { label: '왜 소수 p를 쓰는가?', body: '소수 mod에서만 모든 원소가 역원을 가진다 — 합성수에선 역원이 존재하지 않는 원소 발생.' },
  { label: '왜 소수 위수 q의 부분군인가?', body: '위수가 합성수면 Pohlig-Hellman 공격으로 소인수별 분해 가능 — 소수 위수면 분해 불가.' },
  { label: '왜 생성원 g인가?', body: '생성원은 부분군 전체를 생성하여 a가 균일 분포 — 비생성원은 일부만 반복.' },
];

const MID = 210;

export default function WhyParamsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: prime vs composite inverse */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* mod 7 — OK */}
              <rect x={30} y={15} width={160} height={90} rx={6}
                fill={`${C.ok}08`} stroke={C.ok} strokeWidth={1} />
              <text x={110} y={34} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ok}>
                mod 7 (소수)
              </text>
              {[['1×1=1 ✓', ''], ['2×4=8≡1 ✓', ''], ['3×5=15≡1 ✓', ''], ['6×6=36≡1 ✓', '']].map(([t], i) => (
                <text key={i} x={50} y={52 + i * 14} fontSize={9} fill={C.ok}>{t}</text>
              ))}
              {/* mod 6 — BAD */}
              <rect x={230} y={15} width={160} height={90} rx={6}
                fill={`${C.bad}08`} stroke={C.bad} strokeWidth={1} />
              <text x={310} y={34} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bad}>
                mod 6 (합성수)
              </text>
              {['1×1=1 ✓', '2×?=≡1 ✗ 역원 없음', '3×?=≡1 ✗ 역원 없음', '4×?=≡1 ✗ 역원 없음'].map((t, i) => (
                <text key={i} x={250} y={52 + i * 14} fontSize={9}
                  fill={i === 0 ? C.ok : C.bad}>{t}</text>
              ))}
            </motion.g>
          )}

          {/* Step 1: subgroup order */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={MID} y={20} textAnchor="middle" fontSize={10} fontWeight={500}
                fill="var(--foreground)">p−1 = 22 = 2 × 11</text>
              {/* Composite order */}
              <rect x={30} y={35} width={160} height={75} rx={6}
                fill={`${C.bad}08`} stroke={C.bad} strokeWidth={1} />
              <text x={110} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bad}>
                위수 22 그대로 사용
              </text>
              <text x={110} y={68} textAnchor="middle" fontSize={9} fill={C.bad}>
                위수 2 부분군에서 먼저 풀기
              </text>
              <text x={110} y={82} textAnchor="middle" fontSize={9} fill={C.bad}>
                → 나머지 mod 11만 풀면 끝
              </text>
              <text x={110} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bad}>
                Pohlig-Hellman 공격 ✗
              </text>
              {/* Prime order */}
              <rect x={230} y={35} width={160} height={75} rx={6}
                fill={`${C.ok}08`} stroke={C.ok} strokeWidth={1} />
              <text x={310} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ok}>
                위수 q=11 (소수) 부분군
              </text>
              <text x={310} y={68} textAnchor="middle" fontSize={9} fill={C.ok}>
                더 작은 부분군으로 쪼갤 수 없음
              </text>
              <text x={310} y={82} textAnchor="middle" fontSize={9} fill={C.ok}>
                → 전수 탐색만 가능
              </text>
              <text x={310} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ok}>
                공격 차단 ✓
              </text>
            </motion.g>
          )}

          {/* Step 2: generator vs non-generator */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Generator g=4 */}
              <rect x={20} y={10} width={180} height={105} rx={6}
                fill={`${C.ok}08`} stroke={C.ok} strokeWidth={1} />
              <text x={110} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ok}>
                g=4 (생성원, 위수 11)
              </text>
              {['4¹=4', '4²=16', '4³=18', '4⁴=3', '4⁵=12'].map((t, i) => (
                <motion.text key={i} x={35} y={46 + i * 14} fontSize={9} fill={C.ok}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}>{t}</motion.text>
              ))}
              {['4⁶=2', '4⁷=8', '4⁸=9', '4⁹=13', '…11개 전부'].map((t, i) => (
                <motion.text key={i} x={115} y={46 + i * 14} fontSize={9}
                  fill={C.ok} fontWeight={i === 4 ? 600 : 400}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: (i + 5) * 0.08 }}>{t}</motion.text>
              ))}
              {/* Non-generator g=2 */}
              <rect x={220} y={10} width={180} height={105} rx={6}
                fill={`${C.bad}08`} stroke={C.bad} strokeWidth={1} />
              <text x={310} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bad}>
                g=2 (비생성원, 위수 ≠11)
              </text>
              {['2¹=2', '2²=4', '2³=8', '2⁴=16', '2⁵=9'].map((t, i) => (
                <motion.text key={i} x={235} y={46 + i * 14} fontSize={9} fill={C.bad}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}>{t}</motion.text>
              ))}
              {['2⁶=18', '2⁷=13', '2⁸=3', '2⁹=6', '…일부만 반복'].map((t, i) => (
                <motion.text key={i} x={315} y={46 + i * 14} fontSize={9}
                  fill={C.bad} fontWeight={i === 4 ? 600 : 400}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: (i + 5) * 0.08 }}>{t}</motion.text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
