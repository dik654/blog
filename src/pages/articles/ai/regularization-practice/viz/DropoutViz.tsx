import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS } from './DropoutData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 각 layer의 뉴런 좌표 */
const layers = [
  { x: 60, neurons: 3, label: 'Input' },
  { x: 170, neurons: 5, label: 'Hidden 1' },
  { x: 280, neurons: 5, label: 'Hidden 2' },
  { x: 390, neurons: 2, label: 'Output' },
];
const ny = (count: number, idx: number) => 50 + (idx - (count - 1) / 2) * 30;

/* step=1일 때 드롭되는 뉴런 (layer, index) */
const dropped = new Set(['1-1', '1-3', '2-0', '2-4']);

function isDropped(li: number, ni: number, step: number): boolean {
  return step >= 1 && step <= 2 && dropped.has(`${li}-${ni}`);
}

/* 연결선 */
function Connections({ step }: { step: number }) {
  const lines: { x1: number; y1: number; x2: number; y2: number; drop: boolean }[] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const l1 = layers[li], l2 = layers[li + 1];
    for (let i = 0; i < l1.neurons; i++) {
      for (let j = 0; j < l2.neurons; j++) {
        const d = isDropped(li, i, step) || isDropped(li + 1, j, step);
        lines.push({ x1: l1.x, y1: ny(l1.neurons, i), x2: l2.x, y2: ny(l2.neurons, j), drop: d });
      }
    }
  }
  return (
    <g>
      {lines.map((l, i) => (
        <line key={i} x1={l.x} y1={l.y1} x2={l.x} y2={l.y2}
          stroke={l.drop ? '#88888830' : '#88888860'} strokeWidth={0.4} />
      ))}
    </g>
  );
}

/* Spatial Dropout: 채널 그리드 */
function SpatialGrid({ step }: { step: number }) {
  const channels = [
    { label: 'Ch 0', color: '#3b82f6', dropped: false },
    { label: 'Ch 1', color: '#ef4444', dropped: true },
    { label: 'Ch 2', color: '#10b981', dropped: false },
    { label: 'Ch 3', color: '#f59e0b', dropped: true },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Spatial Dropout (CNN)</text>
      {channels.map((ch, ci) => {
        const cx = 60 + ci * 100;
        const isOff = step === 3 && ch.dropped;
        return (
          <g key={ci}>
            <text x={cx + 32} y={36} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={isOff ? '#888' : ch.color}>{ch.label}</text>
            {/* 4x4 feature map */}
            {Array.from({ length: 16 }).map((_, pi) => {
              const px = cx + (pi % 4) * 16;
              const py = 42 + Math.floor(pi / 4) * 16;
              return (
                <motion.rect key={pi} x={px} y={py} width={14} height={14} rx={2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOff ? 0.1 : 0.7 }}
                  transition={{ ...sp, delay: pi * 0.02 }}
                  fill={isOff ? '#888' : ch.color} />
              );
            })}
            {isOff && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <line x1={cx} y1={42} x2={cx + 62} y2={104} stroke={COLORS.dropped} strokeWidth={1.5} />
                <line x1={cx + 62} y1={42} x2={cx} y2={104} stroke={COLORS.dropped} strokeWidth={1.5} />
                <text x={cx + 32} y={118} textAnchor="middle" fontSize={7}
                  fill={COLORS.dropped} fontWeight={600}>채널 OFF</text>
              </motion.g>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function DropoutViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 2 ? (
            <g>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">
                {step === 0 ? '전체 네트워크' : step === 1 ? 'Dropout (p=0.5)' : 'Inverted Dropout'}
              </text>
              <Connections step={step} />
              {layers.map((l, li) => (
                <g key={li}>
                  <text x={l.x} y={180} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{l.label}</text>
                  {Array.from({ length: l.neurons }).map((_, ni) => {
                    const cy = ny(l.neurons, ni);
                    const drop = isDropped(li, ni, step);
                    const scale = step === 2 && !drop && (li === 1 || li === 2);
                    return (
                      <motion.g key={ni}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...sp, delay: (li * 0.08 + ni * 0.04) }}>
                        <circle cx={l.x} cy={cy} r={10}
                          fill={drop ? '#88888820' : `${COLORS.active}20`}
                          stroke={drop ? '#88888860' : COLORS.active}
                          strokeWidth={drop ? 0.5 : 1.2} />
                        {drop && (
                          <g>
                            <line x1={l.x - 6} y1={cy - 6} x2={l.x + 6} y2={cy + 6}
                              stroke={COLORS.dropped} strokeWidth={1.2} />
                            <line x1={l.x + 6} y1={cy - 6} x2={l.x - 6} y2={cy + 6}
                              stroke={COLORS.dropped} strokeWidth={1.2} />
                          </g>
                        )}
                        {scale && (
                          <text x={l.x} y={cy + 3} textAnchor="middle" fontSize={7}
                            fill={COLORS.scaled} fontWeight={700}>×2</text>
                        )}
                      </motion.g>
                    );
                  })}
                </g>
              ))}
              {/* Inverted Dropout 설명 */}
              {step === 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                  <rect x={130} y={162} width={200} height={18} rx={4}
                    fill={`${COLORS.scaled}15`} stroke={COLORS.scaled} strokeWidth={0.6} />
                  <text x={230} y={174} textAnchor="middle" fontSize={8}
                    fill={COLORS.scaled} fontWeight={600}>
                    활성 뉴런 출력 × 1/(1-p) = ×2 (p=0.5)
                  </text>
                </motion.g>
              )}
            </g>
          ) : (
            <SpatialGrid step={step} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
