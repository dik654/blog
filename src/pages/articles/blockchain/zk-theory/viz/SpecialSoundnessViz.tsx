import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import StepViz from '@/components/ui/step-viz';

const C = { a: '#6366f1', b: '#f59e0b', x: '#ef4444', ok: '#10b981' };

const Sup = ({ children }: { children: ReactNode }) => (
  <tspan baselineShift="super" fontSize="75%">{children}</tspan>
);

// Schnorr 수치: p=23, q=11, g=4, x=3, y=18
// 커밋 a=8 (r=7) 고정, 챌린지 e₁=2 → z₁=2,  e₂=5 → z₂=0
// x = (z₁-z₂)/(e₁-e₂) mod q = (2-0)/(2-5) mod 11 = 2/(-3) mod 11 = 2·(11-4) = 2·8 mod 11 = 5...
// Actually let me recalculate:
// z₁ = r + e₁·x = 7 + 2·3 = 13 mod 11 = 2
// z₂ = r + e₂·x = 7 + 5·3 = 22 mod 11 = 0
// x = (z₁ - z₂) · (e₁ - e₂)⁻¹ mod q
//   = (2 - 0) · (2 - 5)⁻¹ mod 11
//   = 2 · (-3)⁻¹ mod 11
//   = 2 · 8⁻¹... wait, -3 mod 11 = 8, 8⁻¹ mod 11: 8·7=56=5·11+1, so 8⁻¹=7
//   = 2 · 7 mod 11 = 14 mod 11 = 3 ✓

const STEPS = [
  { label: '특수 건전성 — 같은 커밋, 다른 챌린지', body: '같은 커밋 a에 대해 두 번의 다른 챌린지를 받으면 비밀 x를 역산할 수 있다.' },
  { label: '① 같은 커밋 a=8, 챌린지 e₁=2 → z₁=2', body: 'z₁ = r + e₁·x mod q = 7 + 2·3 mod 11 = 2.' },
  { label: '② 같은 커밋 a=8, 챌린지 e₂=5 → z₂=0', body: 'z₂ = r + e₂·x mod q = 7 + 5·3 mod 11 = 0.' },
  { label: '③ 두 응답의 차이로 x 역산', body: 'x = (z₁−z₂)·(e₁−e₂)⁻¹ mod q = 2·7 mod 11 = 3. 비밀 복원!' },
];

const LX = 40, RX = 260, W = 160, TY = 10;

export default function SpecialSoundnessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 두 세션 박스 */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.3 }}>
            <rect x={LX} y={TY} width={W} height={80} rx={6}
              fill={`${C.a}08`} stroke={C.a} strokeWidth={step === 1 ? 1.2 : 0.6} />
            <text x={LX + W / 2} y={TY + 16} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.a}>세션 1</text>
            <text x={LX + W / 2} y={TY + 34} textAnchor="middle" fontSize={9} fill={C.a}>a = 8, e₁ = 2</text>
            <text x={LX + W / 2} y={TY + 50} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.a}>z₁ = 2</text>
            {step === 1 && (
              <motion.text x={LX + W / 2} y={TY + 68} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
                7 + 2·3 mod 11 = 2
              </motion.text>
            )}
          </motion.g>

          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.3 }}>
            <rect x={RX} y={TY} width={W} height={80} rx={6}
              fill={`${C.b}08`} stroke={C.b} strokeWidth={step === 2 ? 1.2 : 0.6} />
            <text x={RX + W / 2} y={TY + 16} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.b}>세션 2</text>
            <text x={RX + W / 2} y={TY + 34} textAnchor="middle" fontSize={9} fill={C.b}>a = 8, e₂ = 5</text>
            <text x={RX + W / 2} y={TY + 50} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.b}>z₂ = 0</text>
            {step === 2 && (
              <motion.text x={RX + W / 2} y={TY + 68} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
                7 + 5·3 mod 11 = 0
              </motion.text>
            )}
          </motion.g>

          {/* 역산 결과 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={LX + W / 2} y1={TY + 82} x2={190} y2={TY + 105} stroke={C.a} strokeWidth={0.8} />
              <line x1={RX + W / 2} y1={TY + 82} x2={270} y2={TY + 105} stroke={C.b} strokeWidth={0.8} />
              <rect x={140} y={TY + 100} width={180} height={36} rx={6}
                fill={C.x} stroke={C.x} strokeWidth={1} />
              <text x={230} y={TY + 114} textAnchor="middle" fontSize={9} fontWeight={500} fill="#fff">
                x = (z₁−z₂)·(e₁−e₂)⁻¹ mod q
              </text>
              <text x={230} y={TY + 128} textAnchor="middle" fontSize={10} fontWeight={600} fill="#fff">
                = 2·7 mod 11 = 3 ← 비밀 복원!
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
