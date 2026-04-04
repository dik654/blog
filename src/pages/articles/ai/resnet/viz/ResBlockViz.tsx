import { motion } from 'framer-motion';
import { CONV_COLOR, BN_COLOR, RELU_COLOR } from '../ArchitectureData';

const SKIP_COLOR = '#3b82f6';
const spring = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

function Box({ x, y, w, h, label, color }: {
  x: number; y: number; w: number; h: number; label: string; color: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4}
        fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle"
        fontSize={9} fill={color} fontWeight={500}>{label}</text>
    </g>
  );
}

export default function ResBlockViz({ step }: { step: number }) {
  const isBottleneck = step === 1;

  return (
    <svg viewBox="0 0 420 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {!isBottleneck ? (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
          <Box x={10} y={50} w={50} h={28} label="3x3 Conv" color={CONV_COLOR} />
          <Box x={75} y={50} w={36} h={28} label="BN" color={BN_COLOR} />
          <Box x={126} y={50} w={36} h={28} label="ReLU" color={RELU_COLOR} />
          <Box x={177} y={50} w={50} h={28} label="3x3 Conv" color={CONV_COLOR} />
          <Box x={242} y={50} w={36} h={28} label="BN" color={BN_COLOR} />
          <circle cx={304} cy={64} r={10} fill="none" stroke={SKIP_COLOR} strokeWidth={1.5} />
          <text x={304} y={67} textAnchor="middle" fontSize={10} fill={SKIP_COLOR} fontWeight={600}>+</text>
          <Box x={330} y={50} w={36} h={28} label="ReLU" color={RELU_COLOR} />

          {/* arrows */}
          {[60, 111, 162, 227, 278].map(x => (
            <line key={x} x1={x} y1={64} x2={x + 15} y2={64}
              stroke="var(--muted-foreground)" strokeWidth={1} strokeOpacity={0.4} />
          ))}
          <line x1={314} y1={64} x2={330} y2={64}
            stroke="var(--muted-foreground)" strokeWidth={1} strokeOpacity={0.4} />

          {/* skip connection */}
          <path d="M 10 50 Q 10 25, 160 25 Q 304 25, 304 50"
            fill="none" stroke={SKIP_COLOR} strokeWidth={1.5}
            strokeDasharray="5 3" strokeOpacity={0.5} />
          <text x={160} y={20} textAnchor="middle" fontSize={9}
            fill={SKIP_COLOR} fillOpacity={0.7}>x (스킵)</text>
          <text x={210} y={110} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">Basic Block</text>
        </motion.g>
      ) : (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
          <Box x={10} y={50} w={50} h={28} label="1x1 Conv" color={CONV_COLOR} />
          <Box x={72} y={50} w={28} h={28} label="BN" color={BN_COLOR} />
          <Box x={112} y={50} w={30} h={28} label="ReLU" color={RELU_COLOR} />
          <Box x={154} y={50} w={50} h={28} label="3x3 Conv" color={CONV_COLOR} />
          <Box x={216} y={50} w={28} h={28} label="BN" color={BN_COLOR} />
          <Box x={256} y={50} w={30} h={28} label="ReLU" color={RELU_COLOR} />
          <Box x={298} y={50} w={50} h={28} label="1x1 Conv" color={CONV_COLOR} />
          <Box x={360} y={50} w={28} h={28} label="BN" color={BN_COLOR} />
          <circle cx={404} cy={64} r={8} fill="none" stroke={SKIP_COLOR} strokeWidth={1.5} />
          <text x={404} y={67} textAnchor="middle" fontSize={9} fill={SKIP_COLOR} fontWeight={600}>+</text>

          <path d="M 10 50 Q 10 25, 210 25 Q 404 25, 404 50"
            fill="none" stroke={SKIP_COLOR} strokeWidth={1.5}
            strokeDasharray="5 3" strokeOpacity={0.5} />
          <text x={210} y={18} textAnchor="middle" fontSize={9}
            fill={SKIP_COLOR} fillOpacity={0.7}>x (스킵)</text>
          <text x={210} y={110} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">Bottleneck Block (256→64→64→256)</text>
        </motion.g>
      )}

      {/* Variant table (step 2) */}
      {step >= 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
          <text x={210} y={130} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">
            ResNet-18(11.7M) | ResNet-50(25.6M) | ResNet-152(60.2M)
          </text>
        </motion.g>
      )}
    </svg>
  );
}
