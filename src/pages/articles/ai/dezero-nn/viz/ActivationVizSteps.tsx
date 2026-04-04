import { motion } from 'framer-motion';
import { CV, CE, CA } from './ActivationVizData';

function curve(pts: [number, number][], color: string, delay: number) {
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]} ${p[1]}`).join(' ');
  return (
    <motion.path d={d} fill="none" stroke={color} strokeWidth={1.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay, duration: 0.6 }} />
  );
}

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const pts = (fn: (x: number) => number, oy: number, sy: number): [number, number][] =>
  Array.from({ length: 41 }, (_, i) => {
    const x = (i - 20) / 5;
    return [110 + i * 5, oy - fn(x) * sy] as [number, number];
  });

export function SigmoidStep() {
  return (
    <g>
      <line x1={110} y1={20} x2={110} y2={130} stroke="var(--border)" strokeWidth={0.5} />
      <line x1={30} y1={75} x2={320} y2={75} stroke="var(--border)" strokeWidth={0.5} />
      {curve(pts(sigmoid, 130, 100), CE, 0.1)}
      <text x={325} y={40} fontSize={8} fontWeight={600} fill={CE}>σ(x)</text>
      <text x={325} y={54} fontSize={7} fill="var(--muted-foreground)">범위: (0, 1)</text>
      <text x={325} y={90} fontSize={8} fill={CA}>σ' = y(1-y)</text>
      <text x={325} y={104} fontSize={7} fill="var(--muted-foreground)">y 재활용</text>
    </g>
  );
}

export function TanhStep() {
  return (
    <g>
      <line x1={110} y1={20} x2={110} y2={130} stroke="var(--border)" strokeWidth={0.5} />
      <line x1={30} y1={75} x2={320} y2={75} stroke="var(--border)" strokeWidth={0.5} />
      {curve(pts(Math.tanh, 75, 50), CV, 0.1)}
      <text x={325} y={40} fontSize={8} fontWeight={600} fill={CV}>tanh(x)</text>
      <text x={325} y={54} fontSize={7} fill="var(--muted-foreground)">범위: (-1, 1)</text>
      <text x={325} y={90} fontSize={8} fill={CA}>1 - y²</text>
      <text x={325} y={104} fontSize={7} fill="var(--muted-foreground)">sigmoid과 같은 패턴</text>
    </g>
  );
}

export function GELUStep() {
  const gelu = (x: number) => {
    const s = Math.sqrt(2 / Math.PI);
    return 0.5 * x * (1 + Math.tanh(s * (x + 0.044715 * x ** 3)));
  };
  return (
    <g>
      <line x1={110} y1={20} x2={110} y2={130} stroke="var(--border)" strokeWidth={0.5} />
      <line x1={30} y1={75} x2={320} y2={75} stroke="var(--border)" strokeWidth={0.5} />
      {curve(pts(gelu, 75, 25), CA, 0.1)}
      <text x={325} y={40} fontSize={8} fontWeight={600} fill={CA}>GELU(x)</text>
      <text x={325} y={54} fontSize={7} fill="var(--muted-foreground)">Transformer 표준</text>
      <text x={325} y={90} fontSize={8} fill={CV}>0.5(1+tanh(u))+...</text>
      <text x={325} y={104} fontSize={7} fill="var(--muted-foreground)">chain rule 수동 전개</text>
    </g>
  );
}

export function TraitIntegStep() {
  const items = [
    { y: 30, label: 'struct SigmoidFn', c: CE },
    { y: 62, label: 'struct TanhFn', c: CV },
    { y: 94, label: 'struct GELUFn', c: CA },
  ];
  return (
    <g>
      {items.map((it, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <rect x={30} y={it.y} width={120} height={26} rx={4}
            fill={`${it.c}10`} stroke={it.c} strokeWidth={1} />
          <text x={90} y={it.y + 16} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={it.c}>{it.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={220} y={40} width={160} height={50} rx={5}
          fill={`${CV}08`} stroke={CV} strokeWidth={1} />
        <text x={300} y={60} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={CV}>impl Function</text>
        <text x={300} y={76} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">forward() + backward()</text>
      </motion.g>
      {[0, 1, 2].map(i => (
        <motion.line key={i} x1={150} y1={items[i].y + 13} x2={220} y2={65}
          stroke={items[i].c} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }} />
      ))}
    </g>
  );
}
