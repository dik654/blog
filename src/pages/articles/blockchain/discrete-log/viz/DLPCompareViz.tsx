import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { fwd: '#10b981', rev: '#ef4444', base: '#6366f1' };

const STEPS = [
  { label: '이산로그 문제 — 정방향 vs 역방향', body: 'g^x ≡ y (mod p). 정방향은 쉽고 역방향은 어렵다. 이 비대칭이 암호학의 핵심이다.' },
  { label: '정방향 — 반복 제곱법 O(log x)', body: '이진 전개로 곱셈 횟수 = 비트 수. 256-bit여도 256번이면 충분.' },
  { label: '역방향 — 전수 탐색 O(p)', body: 'x=1부터 하나씩 시도. 최선(BSGS)도 O(√p).' },
  { label: '큰 소수에서는 사실상 불가능', body: 'BSGS도 O(√p). p=256-bit이면 √p≈2¹²⁸ — 사실상 불가능.' },
];

const LX = 55, RX = 275, W = 150, TY = 12;

export default function DLPCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={TY} textAnchor="middle" fontSize={9} fill="var(--foreground)" fontWeight={500}>
            g = 3,  p = 17
          </text>
          {/* Forward box */}
          <motion.g animate={{ opacity: step === 0 || step === 1 ? 1 : 0.15 }}>
            <rect x={LX} y={TY + 8} width={W} height={115} rx={6}
              fill={`${C.fwd}08`} stroke={C.fwd} strokeWidth={step === 1 ? 1.2 : 0.6} />
            <text x={LX + W / 2} y={TY + 26} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fwd}>
              정방향 (쉽다)
            </text>
            <text x={LX + W / 2} y={TY + 40} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              x = 5 → y = ?
            </text>
          </motion.g>
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['3¹ = 3', '3² = 9', '3⁴ = 9² mod 17 = 13', '3⁵ = 13·3 mod 17 = 5 ✓'].map((t, i) => (
                <motion.text key={i} x={LX + 14} y={TY + 58 + i * 16} fontSize={9}
                  fill={C.fwd} fontWeight={i === 3 ? 600 : 400}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}>{t}</motion.text>
              ))}
            </motion.g>
          )}
          {/* Reverse box */}
          <motion.g animate={{ opacity: step === 0 || step === 2 ? 1 : 0.15 }}>
            <rect x={RX} y={TY + 8} width={W} height={115} rx={6}
              fill={`${C.rev}08`} stroke={C.rev} strokeWidth={step >= 2 ? 1.2 : 0.6} />
            <text x={RX + W / 2} y={TY + 26} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.rev}>
              역방향 (어렵다)
            </text>
            <text x={RX + W / 2} y={TY + 40} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              y = 5 → x = ?
            </text>
          </motion.g>
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['x=1: 3¹ = 3   ✗', 'x=2: 3² = 9   ✗', 'x=3: 3³ = 10  ✗', 'x=4: 3⁴ = 13  ✗', 'x=5: 3⁵ = 5   ✓'].map((t, i) => (
                <motion.text key={i} x={RX + 14} y={TY + 55 + i * 14} fontSize={9}
                  fill={i === 4 ? C.fwd : C.rev} fontWeight={i === 4 ? 600 : 400}
                  initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}>{t}</motion.text>
              ))}
            </motion.g>
          )}
          {/* Scale comparison */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={LX + W / 2} y={TY + 68} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.fwd}>
                O(log x) = 8번
              </text>
              <text x={RX + W / 2} y={TY + 68} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.rev}>
                O(p) ≈ 2²⁵⁶번
              </text>
              <motion.g initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <rect x={130} y={TY + 85} width={220} height={26} rx={13}
                  fill={C.base} stroke={C.base} strokeWidth={1} />
                <text x={240} y={TY + 102} textAnchor="middle" fontSize={9} fontWeight={600} fill="#fff">
                  이 비대칭이 공개키 암호의 기반
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
