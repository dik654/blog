import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { pt: '#6366f1', line: '#10b981', poly: '#f59e0b' };

// f(x) = 1 + 2x + x² → f(0)=1, f(1)=4, f(2)=9
const POINTS = [
  { x: 0, y: 1 }, { x: 1, y: 4 }, { x: 2, y: 9 },
];

const STEPS = [
  { label: '3개 점이 주어졌다', body: '3개 점 → 2차 다항식이 유일하게 결정된다.' },
  { label: '점 2개 → 직선 (1차)', body: '(0,1)과 (1,4)만으로는 직선만 결정 — (2,9)를 못 지남.' },
  { label: '점 3개 → 포물선 (2차)', body: 'f(x)=1+2x+x². f(0)=1, f(1)=4, f(2)=9 모두 통과.' },
];

// SVG coordinate system: chart area
const AX = 55;            // axis origin x (y-axis position)
const CX = 90, CY = 15, CW = 190, CH = 100;
const AY = CY + CH;      // axis origin y (x-axis position)
const sx = (v: number) => CX + v * (CW / 2.5);
const sy = (v: number) => CY + CH - v * (CH / 10);
const X_TICKS = [0, 1, 2];
const Y_TICKS = [0, 3, 6, 9];

export default function LagrangeConceptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Axes */}
          <defs>
            <marker id="arrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto-start-auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke="currentColor" strokeWidth={1} />
            </marker>
          </defs>
          {/* grid lines (behind data) */}
          {X_TICKS.map(v => (
            <line key={`xg-${v}`} x1={sx(v)} y1={AY} x2={sx(v)} y2={CY}
              stroke="currentColor" opacity={0.12} strokeWidth={0.5} strokeDasharray="3 3" />
          ))}
          {Y_TICKS.filter(v => v > 0).map(v => (
            <line key={`yg-${v}`} x1={AX} y1={sy(v)} x2={CX + CW} y2={sy(v)}
              stroke="currentColor" opacity={0.12} strokeWidth={0.5} strokeDasharray="3 3" />
          ))}
          {/* x-axis */}
          <line x1={AX} y1={AY} x2={CX + CW + 10} y2={AY}
            stroke="currentColor" opacity={0.5} strokeWidth={1} markerEnd="url(#arrow)" />
          {/* y-axis */}
          <line x1={AX} y1={AY} x2={AX} y2={CY - 5}
            stroke="currentColor" opacity={0.5} strokeWidth={1} markerEnd="url(#arrow)" />
          <text x={CX + CW + 18} y={AY + 1} fontSize={9} fill="currentColor" opacity={0.5}>x</text>
          <text x={AX} y={CY - 10} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5}>y</text>
          {/* x ticks */}
          {X_TICKS.map(v => (
            <g key={`xt-${v}`}>
              <line x1={sx(v)} y1={AY} x2={sx(v)} y2={AY + 4}
                stroke="currentColor" opacity={0.4} strokeWidth={0.8} />
              <text x={sx(v)} y={AY + 12} textAnchor="middle"
                fontSize={9} fill="currentColor" opacity={0.5}>{v}</text>
            </g>
          ))}
          {/* y ticks */}
          {Y_TICKS.map(v => (
            <g key={`yt-${v}`}>
              <line x1={AX - 4} y1={sy(v)} x2={AX} y2={sy(v)}
                stroke="currentColor" opacity={0.4} strokeWidth={0.8} />
              <text x={AX - 7} y={sy(v) + 3} textAnchor="end"
                fontSize={9} fill="currentColor" opacity={0.5}>{v}</text>
            </g>
          ))}

          {/* Points */}
          {POINTS.map((p, i) => (
            <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', bounce: 0.2 }}>
              <circle cx={sx(p.x)} cy={sy(p.y)} r={5}
                fill={`${C.pt}30`} stroke={C.pt} strokeWidth={1.5} />
              <text x={sx(p.x)} y={sy(p.y) - 10} textAnchor="middle"
                fontSize={9} fontWeight={500} fill={C.pt}>({p.x}, {p.y})</text>
            </motion.g>
          ))}

          {/* Step 1: line through 2 points */}
          {step === 1 && (
            <motion.line x1={sx(-0.3)} y1={sy(1 + 3 * -0.3)} x2={sx(2.3)} y2={sy(1 + 3 * 2.3)}
              stroke={C.line} strokeWidth={1} strokeDasharray="4 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
          )}

          {/* Step 2: parabola through 3 points (approximate with polyline) */}
          {step === 2 && (
            <motion.path
              d={`M${sx(-0.3)},${sy(1 + 2 * -0.3 + 0.09)} ${Array.from({ length: 30 }, (_, i) => {
                const x = -0.3 + i * 0.1;
                return `L${sx(x)},${sy(1 + 2 * x + x * x)}`;
              }).join(' ')}`}
              fill="none" stroke={C.poly} strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          )}

          {/* Right side info */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <rect x={310} y={30} width={140} height={52} rx={5}
                fill={`${C.line}10`} stroke={C.line} strokeWidth={0.8} />
              <text x={380} y={52} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.line}>
                y = 1 + 3x (직선)
              </text>
              <text x={380} y={70} textAnchor="middle" fontSize={10} fill={C.line}>
                f(2) = 7 ≠ 9 ✗
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <rect x={310} y={18} width={140} height={80} rx={5}
                fill={`${C.poly}10`} stroke={C.poly} strokeWidth={0.8} />
              <text x={380} y={38} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.poly}>
                f(x) = 1 + 2x + x²
              </text>
              <text x={380} y={58} textAnchor="middle" fontSize={10} fill={C.poly}>f(0)=1 ✓</text>
              <text x={380} y={74} textAnchor="middle" fontSize={10} fill={C.poly}>f(1)=4 ✓</text>
              <text x={380} y={90} textAnchor="middle" fontSize={10} fill={C.poly}>f(2)=9 ✓</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
