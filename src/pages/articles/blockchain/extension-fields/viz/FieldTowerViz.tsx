import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const LAYERS = [
  { label: 'Fp', ext: '소수체', size: '1', c: '#6b7280', y: 82 },
  { label: 'Fp2', ext: 'u² = -1', size: '2', c: '#6366f1', y: 62 },
  { label: 'Fp6', ext: 'v³ = 9+u', size: '6', c: '#f59e0b', y: 42 },
  { label: 'Fp12', ext: 'w² = v', size: '12', c: '#ec4899', y: 22 },
];

const STEPS = [
  { label: 'Fp: 기초 소수체 (256 bit)', body: 'BN254의 기초. G1 점의 좌표. 모든 확장의 토대가 됩니다.' },
  { label: 'Fp → Fp2: 이차 확장', body: 'u²=-1로 확장. a₀+a₁u 형태. 복소수처럼 동작. G2 좌표 공간.' },
  { label: 'Fp2 → Fp6: 삼차 확장', body: 'v³=ξ(=9+u)로 확장. Fp2 원소 3개로 구성. Karatsuba로 곱셈 최적화.' },
  { label: 'Fp6 → Fp12: 이차 확장 → GT', body: 'w²=v로 확장. Fp 원소 12개. e(G1,G2) ∈ GT ⊂ Fp12*.' },
];

export default function FieldTowerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Tower layers — stacking from bottom */}
          {LAYERS.map((l, i) => {
            const visible = i <= step;
            const active = i === step;
            const w = 60 + i * 40; // wider as we go up (more Fp elements)
            const x = 100 - i * 20;
            return (
              <motion.g key={l.label}
                animate={{ opacity: visible ? 1 : 0.1 }} transition={sp}>
                {/* Layer block */}
                <motion.rect x={x} y={l.y} width={w} height={17} rx={3}
                  animate={{
                    fill: active ? `${l.c}25` : `${l.c}0c`,
                    stroke: l.c, strokeWidth: active ? 1.8 : 0.6,
                  }} transition={sp} />
                <text x={x + w / 2} y={l.y + 12} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={l.c}>{l.label}</text>
                {/* Extension label on right */}
                {i > 0 && visible && (
                  <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 0.7, x: 0 }}
                    transition={{ ...sp, delay: 0.1 }}>
                    <text x={x + w + 6} y={l.y + 12} fontSize={9} fill={l.c}>{l.ext}</text>
                  </motion.g>
                )}
                {/* Fp element count visualization */}
                {visible && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                    transition={{ ...sp, delay: 0.15 }}>
                    {Array.from({ length: Math.min(Number(l.size), 12) }).map((_, j) => (
                      <motion.rect key={j}
                        x={210 + j * 10} y={l.y + 3} width={8} height={11} rx={1.5}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ ...sp, delay: j * 0.03 }}
                        fill={`${l.c}30`} stroke={l.c} strokeWidth={0.4} />
                    ))}
                    <text x={210 + Number(l.size) * 10 + 4} y={l.y + 12}
                      fontSize={9} fill={l.c}>{l.size}×Fp</text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}
          {/* Vertical arrows between layers */}
          {[0, 1, 2].map(i => (
            step > i && (
              <motion.line key={`a${i}`}
                x1={100 + (LAYERS[i].label === 'Fp' ? 30 : 30)}
                y1={LAYERS[i].y}
                x2={100 + (LAYERS[i].label === 'Fp' ? 30 : 30)}
                y2={LAYERS[i + 1].y + 17}
                stroke={LAYERS[i + 1].c} strokeWidth={0.7} strokeDasharray="2 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={sp} />
            )
          ))}
        </svg>
      )}
    </StepViz>
  );
}
