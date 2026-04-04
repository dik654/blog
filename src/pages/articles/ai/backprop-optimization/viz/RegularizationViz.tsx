import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import RegWeightDecay from './RegWeightDecay';
import RegEarlyStopping from './RegEarlyStopping';

const NODES = [
  [{ x: 30, y: 30 }, { x: 30, y: 60 }, { x: 30, y: 90 }],
  [{ x: 130, y: 20 }, { x: 130, y: 50 }, { x: 130, y: 80 }, { x: 130, y: 110 }],
  [{ x: 230, y: 40 }, { x: 230, y: 70 }, { x: 230, y: 100 }],
];

const STEPS = [
  { label: '정상 네트워크: 모든 뉴런 활성 (과적합 위험)' },
  { label: 'Dropout (p=0.5): 4개 뉴런 비활성 → 서브넷으로 학습' },
  { label: 'Weight Decay: w=3.2 → 패널티 +10.24, w=0.5 → 패널티 +0.25' },
  { label: 'Early Stopping: val_loss 0.55→0.58 (3회 연속 증가 → 중단)' },
];
const DROP_MASK = [
  [true, true, true],
  [true, false, true, false],
  [false, true, true],
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function RegularizationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 145" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>

          {/* Network edges (steps 0-1) */}
          {step <= 1 && NODES.slice(0, -1).map((layer, li) =>
            layer.map((src, si) =>
              NODES[li + 1].map((dst, di) => {
                const dropped = step === 1 &&
                  (!DROP_MASK[li][si] || !DROP_MASK[li + 1][di]);
                return (
                  <motion.line key={`${li}-${si}-${di}`}
                    x1={src.x + 10} y1={src.y}
                    x2={dst.x - 10} y2={dst.y}
                    stroke="var(--border)" strokeWidth={0.8}
                    animate={{ opacity: dropped ? 0.05 : 0.4 }}
                    transition={sp} />
                );
              })
            )
          )}

          {/* Network nodes (steps 0-1) */}
          {step <= 1 && NODES.map((layer, li) =>
            layer.map((n, ni) => {
              const dropped = step === 1 && !DROP_MASK[li][ni];
              const color = dropped ? '#ef4444' : '#0ea5e9';
              return (
                <g key={`n-${li}-${ni}`}>
                  <motion.circle cx={n.x} cy={n.y} r={8}
                    fill={`${color}20`} stroke={color}
                    strokeWidth={dropped ? 1.5 : 1}
                    strokeDasharray={dropped ? '3 2' : 'none'}
                    animate={{ opacity: dropped ? 0.3 : 1 }}
                    transition={sp} />
                  {dropped && (
                    <motion.text x={n.x} y={n.y + 3}
                      textAnchor="middle" fontSize={8}
                      fill="#ef4444" fontWeight={600}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}>
                      ×
                    </motion.text>
                  )}
                </g>
              );
            })
          )}

          {/* Dropout stats (step 1) */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={sp}>
              <rect x={280} y={15} width={190} height={110} rx={6}
                fill="color-mix(in oklch, var(--muted) 6%, transparent)"
                stroke="var(--border)" strokeWidth={0.6} />
              <text x={375} y={33} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="var(--foreground)">
                Dropout p=0.5
              </text>
              <text x={295} y={50} fontSize={8}
                fill="var(--muted-foreground)">전체 뉴런: 10개</text>
              <text x={295} y={64} fontSize={8}
                fill="#ef4444" fontWeight={600}>비활성: 4개 (×표시)</text>
              <text x={295} y={78} fontSize={8}
                fill="#0ea5e9" fontWeight={600}>활성: 6개 → 서브넷</text>
              <text x={295} y={96} fontSize={8}
                fill="var(--muted-foreground)">매 배치마다 다른 조합</text>
              <text x={295} y={110} fontSize={8}
                fill="var(--muted-foreground)">→ 앙상블 효과로 과적합 방지</text>
            </motion.g>
          )}

          {step === 2 && <RegWeightDecay />}
          {step === 3 && <RegEarlyStopping />}
        </svg>
      )}
    </StepViz>
  );
}
