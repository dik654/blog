import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import {
  STEPS, CENTER, PATH_NORMAL, PATH_LARGE, PATH_SMALL, PATH_SADDLE, COLORS,
} from './SGDVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const PATHS = [PATH_NORMAL, PATH_LARGE, PATH_SMALL, PATH_SADDLE];
const LABELS = ['η = 0.01', 'η = 0.5 (발산)', 'η = 0.001 (느림)', '안장점 정체'];

function Contours({ saddle }: { saddle: boolean }) {
  const rings = [100, 70, 44, 22];
  return (
    <g>
      {rings.map((r, i) => (
        <ellipse key={i} cx={saddle ? 176 : CENTER.x} cy={CENTER.y}
          rx={r * (saddle ? 0.5 : 1.3)} ry={r} fill="none"
          stroke={COLORS.contour} strokeWidth={0.6} opacity={0.25 + i * 0.1} />
      ))}
      {saddle && (
        <text x={176} y={88} textAnchor="middle" fontSize={9}
          fill={COLORS.saddle} fontWeight={500}>saddle point</text>
      )}
    </g>
  );
}

export default function SGDViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const path = PATHS[step];
        return (
          <svg viewBox="0 0 440 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Contours saddle={step === 3} />
            {path.map((p, i) => {
              if (i === 0) return null;
              const prev = path[i - 1];
              return (
                <motion.line key={i} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y}
                  stroke={COLORS.path} strokeWidth={1.2} opacity={0.6}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: i * 0.08 }} />
              );
            })}
            <motion.circle r={4} fill={COLORS.path}
              animate={{ cx: path[path.length - 1].x, cy: path[path.length - 1].y }}
              transition={sp} />
            <motion.text x={path[path.length - 1].x + 10} y={path[path.length - 1].y - 8}
              fontSize={9} fontWeight={500} fill={COLORS.path}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{LABELS[step]}</motion.text>
            {/* 등고선 안내 */}
            <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)" opacity={0.5}>최솟값</text>
            <text x={20} y={18} fontSize={9} fill="var(--muted-foreground)">
              타원 = 손실 등고선 (안쪽일수록 손실 낮음)
            </text>
            <text x={20} y={30} fontSize={9} fill={COLORS.path}>
              선 = SGD 업데이트 경로
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
