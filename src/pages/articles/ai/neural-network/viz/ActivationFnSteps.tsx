import { motion } from 'framer-motion';
import { C } from './ActivationFnVizData';

const W = 340;
const H = 180;
const MX = W / 2;
const MY = H / 2;
const SX = 30;
const SY = 35;

function Axes() {
  return (
    <g>
      <line x1={10} y1={MY} x2={W - 10} y2={MY} stroke={C.axis} strokeWidth={0.5} />
      <line x1={MX} y1={10} x2={MX} y2={H - 10} stroke={C.axis} strokeWidth={0.5} />
      <text x={W - 12} y={MY - 4} fontSize={9} fill={C.axis}>x</text>
      <text x={MX + 4} y={16} fontSize={9} fill={C.axis}>y</text>
      {[-4, -2, 2, 4].map(v => (
        <text key={v} x={MX + v * SX} y={MY + 12} textAnchor="middle" fontSize={8} fill={C.axis}>{v}</text>
      ))}
    </g>
  );
}

function toPath(fn: (x: number) => number, color: string) {
  const pts: string[] = [];
  for (let px = 10; px <= W - 10; px += 2) {
    const x = (px - MX) / SX;
    const y = fn(x);
    const py = MY - y * SY;
    pts.push(`${px},${Math.max(10, Math.min(H - 10, py))}`);
  }
  return (
    <motion.polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
  );
}

type Sample = { x: number; y: number; label: string };

function SampleDots({ samples, fn, color }: { samples: Sample[]; fn: (x: number) => number; color: string }) {
  return (
    <>
      {samples.map((s, i) => {
        const px = MX + s.x * SX;
        const py = MY - fn(s.x) * SY;
        return (
          <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.12 }}>
            <circle cx={px} cy={py} r={4} fill={color} />
            <rect x={px + 5} y={py - 16} width={s.label.length * 5.5 + 8} height={14} rx={3}
              fill="var(--background)" stroke={color} strokeWidth={0.8} />
            <text x={px + 9} y={py - 6} fontSize={8} fontWeight="600" fill={color}>{s.label}</text>
          </motion.g>
        );
      })}
    </>
  );
}

export function SigmoidStep() {
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const samples: Sample[] = [
    { x: -2, y: 0, label: 'σ(-2)=0.12' },
    { x: 0, y: 0, label: 'σ(0)=0.50' },
    { x: 2, y: 0, label: 'σ(2)=0.88' },
  ];
  return (
    <g>
      <Axes />
      {toPath(sigmoid, C.sigmoid)}
      {/* Asymptote labels */}
      <text x={MX + 4.2 * SX} y={MY - 0.95 * SY - 2} fontSize={8} fill={C.sigmoid} fontWeight="600">1</text>
      <text x={MX - 4.2 * SX} y={MY + 4} fontSize={8} fill={C.sigmoid} fontWeight="600">0</text>
      {/* Dashed asymptote lines */}
      <line x1={10} y1={MY - SY} x2={W - 10} y2={MY - SY}
        stroke={C.sigmoid} strokeWidth={0.5} strokeDasharray="4 3" strokeOpacity={0.3} />
      <SampleDots samples={samples} fn={sigmoid} color={C.sigmoid} />
    </g>
  );
}

export function ReLUStep() {
  const relu = (x: number) => Math.max(0, x);
  const samples: Sample[] = [
    { x: -2, y: 0, label: 'f(-2)=0' },
    { x: 0, y: 0, label: 'f(0)=0' },
    { x: 2, y: 0, label: 'f(2)=2' },
  ];
  return (
    <g>
      <Axes />
      {toPath(relu, C.relu)}
      {/* Dead zone annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={20} y={MY - 30} width={70} height={16} rx={4}
          fill="var(--background)" stroke={C.relu} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={55} y={MY - 19} textAnchor="middle" fontSize={8} fill={C.relu}>음수 = 0 (죽은 영역)</text>
      </motion.g>
      <SampleDots samples={samples} fn={relu} color={C.relu} />
    </g>
  );
}

export function TanhStep() {
  const tanh = (x: number) => Math.tanh(x);
  const samples: Sample[] = [
    { x: -2, y: 0, label: 'f(-2)=-0.96' },
    { x: 0, y: 0, label: 'f(0)=0' },
    { x: 2, y: 0, label: 'f(2)=0.96' },
  ];
  return (
    <g>
      <Axes />
      {toPath(tanh, C.tanh)}
      {/* Asymptote labels */}
      <text x={MX + 4.2 * SX} y={MY - 0.95 * SY - 2} fontSize={8} fill={C.tanh} fontWeight="600">1</text>
      <text x={MX + 4.2 * SX} y={MY + 0.95 * SY + 10} fontSize={8} fill={C.tanh} fontWeight="600">-1</text>
      {/* Dashed asymptote lines */}
      <line x1={10} y1={MY - SY} x2={W - 10} y2={MY - SY}
        stroke={C.tanh} strokeWidth={0.5} strokeDasharray="4 3" strokeOpacity={0.3} />
      <line x1={10} y1={MY + SY} x2={W - 10} y2={MY + SY}
        stroke={C.tanh} strokeWidth={0.5} strokeDasharray="4 3" strokeOpacity={0.3} />
      <SampleDots samples={samples} fn={tanh} color={C.tanh} />
    </g>
  );
}
