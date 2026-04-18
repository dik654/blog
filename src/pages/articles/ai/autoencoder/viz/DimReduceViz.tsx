import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, POINTS, COLORS } from './DimReduceVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const M = 'var(--muted-foreground)';

export default function DimReduceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Left panel: high-dim */}
          <rect x={5} y={8} width={170} height={104} rx={6}
            fill="none" stroke={M} strokeWidth={0.5} strokeOpacity={0.3} />
          <text x={90} y={20} textAnchor="middle" fontSize={9}
            fill={M}>고차원 공간</text>

          {POINTS.map((p, i) => (
            <motion.circle key={`h-${i}`}
              cx={p.hx + 20} cy={p.hy + 10}
              r={3.5} fill={COLORS[p.cls]} fillOpacity={0.6}
              stroke={COLORS[p.cls]} strokeWidth={0.8}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...sp, delay: i * 0.02 }} />
          ))}

          {/* Arrow */}
          <text x={200} y={58} textAnchor="middle" fontSize={10}
            fill={M}>&#8594;</text>
          <text x={200} y={72} textAnchor="middle" fontSize={9}
            fill={M}>압축</text>

          {/* Right panel: latent */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={225} y={8} width={185} height={104} rx={6}
                fill="none" stroke={M} strokeWidth={0.5}
                strokeOpacity={0.3} strokeDasharray={step >= 2 ? '4 2' : 'none'} />
              <text x={317} y={20} textAnchor="middle" fontSize={9}
                fill={M}>잠재 공간</text>

              {POINTS.map((p, i) => (
                <motion.circle key={`l-${i}`}
                  cx={p.lx + 200} cy={p.ly + 10}
                  r={3.5} fill={COLORS[p.cls]} fillOpacity={0.7}
                  stroke={COLORS[p.cls]} strokeWidth={0.8}
                  initial={{ cx: p.hx + 200, cy: p.hy + 10 }}
                  animate={{ cx: p.lx + 200, cy: p.ly + 10 }}
                  transition={{ ...sp, delay: i * 0.03 }} />
              ))}

              {/* Cluster circles */}
              <circle cx={256} cy={40} r={20} fill="none"
                stroke={COLORS[0]} strokeWidth={0.6}
                strokeDasharray="3 2" strokeOpacity={0.4} />
              <circle cx={342} cy={40} r={20} fill="none"
                stroke={COLORS[1]} strokeWidth={0.6}
                strokeDasharray="3 2" strokeOpacity={0.4} />
              <circle cx={300} cy={80} r={20} fill="none"
                stroke={COLORS[2]} strokeWidth={0.6}
                strokeDasharray="3 2" strokeOpacity={0.4} />
            </motion.g>
          )}

          {/* PCA vs AE comparison labels */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={90} y={126} textAnchor="middle" fontSize={9}
                fill={M}>PCA: 직선 투영만 가능</text>
              <text x={317} y={126} textAnchor="middle" fontSize={9}
                fill="#f59e0b">AE: 비선형 곡면도 학습</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
