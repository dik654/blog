import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './SAEStructureVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Vec({ x, y, w, h, label, dim, color }: {
  x: number; y: number; w: number; h: number;
  label: string; dim: string; color: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4}
        fill={`${color}18`} stroke={color} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={color}>{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle"
        fontSize={9} fill={C.muted}>{dim}</text>
    </g>
  );
}

export default function SAEStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 110" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* Input vector */}
          <Vec x={10} y={30} w={70} h={50} label="x"
            dim="d=2304" color={C.input} />
          {/* Show sample values */}
          <text x={45} y={72} textAnchor="middle" fontSize={9}
            fill={C.input} fillOpacity={0.6}>[0.3, -0.1, ...]</text>

          {/* Encoder */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={sp}>
              <line x1={80} y1={55} x2={110} y2={55}
                stroke={C.enc} strokeWidth={1} />
              <rect x={112} y={25} width={80} height={60} rx={6}
                fill={`${C.enc}12`} stroke={C.enc} strokeWidth={1.2} />
              <text x={152} y={42} textAnchor="middle" fontSize={9}
                fontWeight={700} fill={C.enc}>Encoder</text>
              <text x={152} y={55} textAnchor="middle" fontSize={9}
                fill={C.muted}>ReLU(Wx + b)</text>
              <text x={152} y={68} textAnchor="middle" fontSize={9}
                fill={C.muted}>2304→16K</text>
              <line x1={192} y1={55} x2={222} y2={55}
                stroke={C.feat} strokeWidth={1} />
            </motion.g>
          )}

          {/* Sparse feature vector */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }} transition={sp}>
              <Vec x={224} y={25} w={70} h={40} label="f"
                dim="d=16K" color={C.feat} />
              {/* Sparsity bars with actual values */}
              {[0, 0, 2.1, 0, 0, 0.8, 0, 0].map((v, i) => {
                const active = v > 0;
                return (
                  <g key={i}>
                    <rect x={300} y={24 + i * 7} width={active ? v * 8 : 3}
                      height={4} rx={1}
                      fill={active ? C.feat : `${C.feat}30`} />
                    {active && (
                      <text x={300 + v * 8 + 3} y={28 + i * 7} fontSize={7}
                        fill={C.feat}>{v}</text>
                    )}
                  </g>
                );
              })}
              <text x={322} y={86} fontSize={9} fill={C.muted}>
                2/16K 활성 (~0.01%)
              </text>
            </motion.g>
          )}

          {/* Decoder */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={sp}>
              <line x1={294} y1={45} x2={324} y2={45}
                stroke={C.dec} strokeWidth={1} />
              <rect x={326} y={25} width={50} height={40} rx={6}
                fill={`${C.dec}12`} stroke={C.dec} strokeWidth={1.2} />
              <text x={351} y={42} textAnchor="middle" fontSize={9}
                fontWeight={700} fill={C.dec}>Dec</text>
              <text x={351} y={55} textAnchor="middle" fontSize={9}
                fill={C.muted}>16K→2304</text>
              <line x1={376} y1={45} x2={396} y2={45}
                stroke={C.out} strokeWidth={1} />
              <Vec x={398} y={28} w={36} h={34} label="x̂"
                dim="" color={C.out} />
              <text x={416} y={72} textAnchor="middle" fontSize={9}
                fill={C.out} fillOpacity={0.6}>[0.29, -0.08, ...]</text>
              {/* Loss */}
              <text x={350} y={86} textAnchor="middle" fontSize={9}
                fill={C.muted}>‖x - x̂‖² + λ‖f‖₁</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
