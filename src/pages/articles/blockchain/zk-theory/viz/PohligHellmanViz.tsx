import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { bad: '#ef4444', a: '#6366f1', b: '#f59e0b', ok: '#10b981' };

// g=5 (order 22, primitive root mod 23), x=15, y=5^15 mod 23=19
const STEPS = [
  { label: 'Pohlig-Hellman 공격 원리', body: '위수가 합성수(22=2×11)이면 소인수별 부분군에서 각각 풀고 CRT로 합산.' },
  { label: '① 위수 2 부분군에서 x mod 2 풀기', body: 'y¹¹ mod 23 = 22 ≡ −1 → x ≡ 1 (mod 2). 시도 1번.' },
  { label: '② 위수 11 부분군에서 x mod 11 풀기', body: 'y² mod 23 = 16, 2⁴ = 16 → x ≡ 4 (mod 11). 시도 4번.' },
  { label: '③ CRT로 합쳐서 x 복원', body: 'x ≡ 1 (mod 2), x ≡ 4 (mod 11) → x = 15 (mod 22). 총 5번 시도.' },
];

export default function PohligHellmanViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Title: factorization */}
          <text x={220} y={18} textAnchor="middle" fontSize={10} fontWeight={500}
            fill="var(--foreground)">
            g=5, y=19, p=23, 위수 = 22 = 2 × 11
          </text>

          {/* Step 0: overview — brute force vs pohlig */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={40} y={32} width={150} height={50} rx={6}
                fill={`${C.bad}08`} stroke={C.bad} strokeWidth={1} />
              <text x={115} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bad}>전수 탐색</text>
              <text x={115} y={68} textAnchor="middle" fontSize={9} fill={C.bad}>22번 시도</text>
              <rect x={250} y={32} width={150} height={50} rx={6}
                fill={`${C.ok}08`} stroke={C.ok} strokeWidth={1} />
              <text x={325} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ok}>Pohlig-Hellman</text>
              <text x={325} y={68} textAnchor="middle" fontSize={9} fill={C.ok}>2 + 11 = 13번 시도</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={100} y={95} width={240} height={26} rx={13}
                  fill={C.bad} stroke={C.bad} strokeWidth={1} />
                <text x={220} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill="#fff">
                  소인수가 많을수록 격차 폭발: 곱 → 합
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: order-2 subgroup */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={30} width={170} height={90} rx={6}
                fill={`${C.a}08`} stroke={C.a} strokeWidth={1} />
              <text x={115} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.a}>
                위수 2 부분군으로 사상
              </text>
              <text x={115} y={66} textAnchor="middle" fontSize={9} fill={C.a}>y¹¹ mod 23 = 22 ≡ −1</text>
              <text x={115} y={80} textAnchor="middle" fontSize={9} fill={C.a}>g¹¹ mod 23 = 22 ≡ −1</text>
              <text x={115} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                (−1)¹ = −1 → x ≡ 1 (mod 2)
              </text>
              <rect x={240} y={50} width={160} height={40} rx={6}
                fill={`${C.a}12`} stroke={C.a} strokeWidth={1} />
              <text x={320} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.a}>
                x mod 2 = 1
              </text>
              <text x={320} y={82} textAnchor="middle" fontSize={9} fill={C.a}>시도 1번 (0 or 1)</text>
            </motion.g>
          )}

          {/* Step 2: order-11 subgroup */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={30} width={170} height={90} rx={6}
                fill={`${C.b}08`} stroke={C.b} strokeWidth={1} />
              <text x={115} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.b}>
                위수 11 부분군으로 사상
              </text>
              <text x={115} y={66} textAnchor="middle" fontSize={9} fill={C.b}>y² mod 23 = 16</text>
              <text x={115} y={80} textAnchor="middle" fontSize={9} fill={C.b}>g² mod 23 = 2</text>
              <text x={115} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                2⁴ = 16 → x ≡ 4 (mod 11)
              </text>
              <rect x={240} y={50} width={160} height={40} rx={6}
                fill={`${C.b}12`} stroke={C.b} strokeWidth={1} />
              <text x={320} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.b}>
                x mod 11 = 4
              </text>
              <text x={320} y={82} textAnchor="middle" fontSize={9} fill={C.b}>시도 4번 (0~10)</text>
            </motion.g>
          )}

          {/* Step 3: CRT combination */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={40} y={30} width={130} height={36} rx={5}
                fill={`${C.a}12`} stroke={C.a} strokeWidth={0.8} />
              <text x={105} y={52} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.a}>
                x ≡ 1 (mod 2)
              </text>
              <rect x={40} y={76} width={130} height={36} rx={5}
                fill={`${C.b}12`} stroke={C.b} strokeWidth={0.8} />
              <text x={105} y={98} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.b}>
                x ≡ 4 (mod 11)
              </text>
              <line x1={175} y1={48} x2={230} y2={72} stroke={C.a} strokeWidth={0.8} />
              <line x1={175} y1={94} x2={230} y2={78} stroke={C.b} strokeWidth={0.8} />
              <rect x={230} y={58} width={55} height={28} rx={5}
                fill={`${C.ok}12`} stroke={C.ok} strokeWidth={0.8} />
              <text x={257} y={76} textAnchor="middle" fontSize={9} fontWeight={500}
                fill={C.ok}>CRT</text>
              <line x1={290} y1={72} x2={310} y2={72} stroke={C.ok} strokeWidth={1} />
              <polygon points="310,69 316,72 310,75" fill={C.ok} />
              <rect x={320} y={55} width={95} height={34} rx={6}
                fill={C.ok} stroke={C.ok} strokeWidth={1} />
              <text x={367} y={72} textAnchor="middle" fontSize={11} fontWeight={600} fill="#fff">
                x = 15 ✓
              </text>
              <text x={367} y={84} textAnchor="middle" fontSize={9} fill="#fff" opacity={0.8}>
                총 5번 시도
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
