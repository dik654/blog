import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, CENTER, SGD_PATH, MOM_PATH, COLORS } from './MomentumVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const rings = [100, 70, 44, 22];

function PathLine({ path, color, active }: { path: typeof SGD_PATH; color: string; active: boolean }) {
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
      {path.map((p, i) => {
        if (i === 0) return null;
        return (
          <line key={i} x1={path[i - 1].x} y1={path[i - 1].y} x2={p.x} y2={p.y}
            stroke={color} strokeWidth={active ? 1.3 : 0.7} opacity={0.7} />
        );
      })}
      <motion.circle r={active ? 4 : 2.5} fill={color}
        animate={{ cx: path[path.length - 1].x, cy: path[path.length - 1].y }} transition={sp} />
    </motion.g>
  );
}

export default function MomentumViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showSGD = step === 0 || step === 3;
        const showMom = step >= 1;
        const showVel = step === 1 || step === 2;
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {rings.map((r, i) => (
              <ellipse key={i} cx={CENTER.x} cy={CENTER.y}
                rx={r * 1.4} ry={r} fill="none"
                stroke={COLORS.contour} strokeWidth={0.6} opacity={0.25 + i * 0.1} />
            ))}

            {showSGD && <PathLine path={SGD_PATH} color={COLORS.sgd} active={step === 0 || step === 3} />}
            {showMom && <PathLine path={MOM_PATH} color={COLORS.momentum} active={step >= 1} />}

            {showVel && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <defs><marker id="vel" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                  <path d="M0,0 L5,2.5 L0,5" fill={COLORS.velocity} />
                </marker></defs>
                <line x1={MOM_PATH[2].x} y1={MOM_PATH[2].y}
                  x2={MOM_PATH[2].x + 35} y2={MOM_PATH[2].y + 3}
                  stroke={COLORS.velocity} strokeWidth={1.2} markerEnd="url(#vel)" />
                <text x={MOM_PATH[2].x + 40} y={MOM_PATH[2].y - 2}
                  fontSize={9} fill={COLORS.velocity} fontWeight={500}>v_t</text>
              </motion.g>
            )}

            {step === 3 && (
              <g>
                <text x={SGD_PATH[5].x} y={SGD_PATH[5].y - 10} fontSize={9}
                  fill={COLORS.sgd} fontWeight={500}>SGD</text>
                <text x={MOM_PATH[4].x} y={MOM_PATH[4].y - 10} fontSize={9}
                  fill={COLORS.momentum} fontWeight={500}>Momentum</text>
              </g>
            )}

            {/* 범례 + 안내 */}
            <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)" opacity={0.5}>최솟값</text>
            <g transform="translate(330, 14)">
              <line x1={0} y1={4} x2={18} y2={4} stroke={COLORS.sgd} strokeWidth={1.2} />
              <text x={22} y={8} fontSize={9} fill={COLORS.sgd}>SGD (지그재그)</text>
              <line x1={0} y1={18} x2={18} y2={18} stroke={COLORS.momentum} strokeWidth={1.2} />
              <text x={22} y={22} fontSize={9} fill={COLORS.momentum}>Momentum (부드럽게)</text>
            </g>
          </svg>
        );
      }}
    </StepViz>
  );
}
