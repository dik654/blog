import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './ResidualStreamVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Block({ x, y, w, h, label, sub, color, dim }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string; color: string; dim: boolean;
}) {
  return (
    <g opacity={dim ? 0.2 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={5}
        fill={`${color}18`} stroke={color} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + h / 2 - 3} textAnchor="middle"
        fontSize={9} fontWeight={700} fill={color}>{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle"
        fontSize={9} fill={C.muted}>{sub}</text>
    </g>
  );
}

export default function ResidualStreamViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 110" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* Embedding */}
          <Block x={10} y={30} w={70} h={50} label="Embed"
            sub="d=2304" color={C.embed} dim={false} />

          {/* Arrow embed -> layer */}
          <line x1={80} y1={55} x2={98} y2={55}
            stroke={C.muted} strokeWidth={1} markerEnd="url(#arr)" />

          {/* Layer block */}
          <Block x={100} y={20} w={100} h={70} label="Layer i"
            sub="Attn + MLP" color={C.attn} dim={step < 1} />
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={108} y={30} width={36} height={20} rx={3}
                fill={`${C.attn}22`} stroke={C.attn} strokeWidth={1} />
              <text x={126} y={43} textAnchor="middle" fontSize={9}
                fill={C.attn}>Attn</text>
              <rect x={156} y={30} width={36} height={20} rx={3}
                fill={`${C.mlp}22`} stroke={C.mlp} strokeWidth={1} />
              <text x={174} y={43} textAnchor="middle" fontSize={9}
                fill={C.mlp}>MLP</text>
            </motion.g>
          )}

          {/* Residual arrow */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={200} y1={55} x2={230} y2={55}
                stroke={C.res} strokeWidth={1.5} />
              <text x={215} y={48} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.res}>+</text>
              <rect x={232} y={35} width={60} height={40} rx={5}
                fill={`${C.res}15`} stroke={C.res} strokeWidth={1.2} />
              <text x={262} y={52} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.res}>잔차 흐름</text>
              <text x={262} y={64} textAnchor="middle" fontSize={9}
                fill={C.muted}>×26 layers</text>
            </motion.g>
          )}

          {/* Final prediction */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={292} y1={55} x2={318} y2={55}
                stroke={C.muted} strokeWidth={1} />
              <rect x={320} y={30} width={80} height={50} rx={5}
                fill={`${C.pred}12`} stroke={C.pred} strokeWidth={1.2} />
              <text x={360} y={50} textAnchor="middle" fontSize={9}
                fontWeight={700} fill={C.pred}>softmax</text>
              <text x={360} y={64} textAnchor="middle" fontSize={9}
                fill={C.muted}>다음 토큰 확률</text>
            </motion.g>
          )}

          <defs>
            <marker id="arr" markerWidth={6} markerHeight={4}
              refX={6} refY={2} orient="auto">
              <path d="M0,0 L6,2 L0,4" fill={C.muted} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
