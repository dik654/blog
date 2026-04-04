import { motion } from 'framer-motion';
import { sigmoid, sigmoidDeriv, COLORS } from './SigmoidData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const mapX = (x: number, ox: number) => ox + x * 14;
const mapY = (y: number, oy: number) => oy - y * 50;

export function CurvePair({ ox }: { ox: number }) {
  const oy = 85;
  const pts = Array.from({ length: 49 }, (_, i) => -6 + i * 0.25);
  const fnPath = pts.map((x, i) => {
    const sx = mapX(x, ox); const sy = mapY(sigmoid(x), oy);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');
  const dPath = pts.map((x, i) => {
    const sx = mapX(x, ox); const sy = mapY(sigmoidDeriv(x), oy);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');
  return (
    <g>
      <line x1={ox - 90} y1={oy} x2={ox + 90} y2={oy}
        stroke="#888" strokeWidth={0.4} />
      <line x1={ox} y1={oy - 60} x2={ox} y2={oy + 30}
        stroke="#888" strokeWidth={0.4} />
      <path d={fnPath} fill="none" stroke={COLORS.fn} strokeWidth={1.2} />
      <path d={dPath} fill="none" stroke={COLORS.deriv} strokeWidth={1.2} />
      <text x={ox + 70} y={mapY(1, oy) + 4} fontSize={9} fill={COLORS.fn}>
        σ(x)
      </text>
      <text x={ox + 65} y={mapY(0.25, oy) - 4} fontSize={9}
        fill={COLORS.deriv}>σ'(x)</text>
      <text x={ox} y={mapY(0.25, oy) - 6} textAnchor="middle" fontSize={9}
        fill={COLORS.deriv}>max=0.25</text>
    </g>
  );
}

export function VanishingBars() {
  const layers = [1, 2, 3, 4, 5];
  const vals = layers.map(l => Math.pow(0.25, l));
  const barW = 40; const barMaxH = 80; const base = 130;
  return (
    <g>
      <text x={220} y={18} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">
        층 수별 최대 기울기
      </text>
      {layers.map((l, i) => {
        const h = Math.max(2, vals[i] * barMaxH / 0.25);
        const bx = 80 + i * (barW + 20);
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={bx} y={base - h} width={barW} height={h}
              rx={3} fill={COLORS.bar} opacity={0.7} />
            <text x={bx + barW / 2} y={base - h - 4} textAnchor="middle"
              fontSize={9} fill={COLORS.bar} fontWeight={500}>
              {vals[i] < 0.01 ? vals[i].toExponential(0) : vals[i].toFixed(3)}
            </text>
            <text x={bx + barW / 2} y={base + 12} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)">{l}층</text>
          </motion.g>
        );
      })}
    </g>
  );
}

const ZZ = [
  { x: 350, y: 30 }, { x: 310, y: 80 }, { x: 380, y: 50 },
  { x: 290, y: 110 }, { x: 360, y: 90 }, { x: 320, y: 120 },
];

export function ZigzagPath() {
  return (
    <g>
      <text x={220} y={18} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">w₁-w₂ 평면 업데이트 경로</text>
      <line x1={60} y1={75} x2={420} y2={75} stroke="#888" strokeWidth={0.4} />
      <line x1={220} y1={20} x2={220} y2={140} stroke="#888" strokeWidth={0.4} />
      <text x={415} y={70} fontSize={9} fill="#888">w₁</text>
      <text x={225} y={28} fontSize={9} fill="#888">w₂</text>
      <text x={320} y={45} fontSize={9} fill={COLORS.zigzag} opacity={0.5}>1사분면</text>
      <text x={120} y={110} fontSize={9} fill={COLORS.zigzag} opacity={0.5}>3사분면</text>
      {ZZ.map((p, i) => i === 0 ? null : (
        <motion.line key={i} x1={ZZ[i - 1].x} y1={ZZ[i - 1].y}
          x2={p.x} y2={p.y} stroke={COLORS.zigzag} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: i * 0.12 }} />
      ))}
      <line x1={350} y1={30} x2={260} y2={100}
        stroke={COLORS.bar} strokeWidth={1} strokeDasharray="4,3" opacity={0.6} />
      <text x={290} y={55} fontSize={9} fill={COLORS.bar}>이상적 경로</text>
      <circle cx={260} cy={100} r={3} fill={COLORS.bar} />
      <text x={260} y={115} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">최적점</text>
    </g>
  );
}
