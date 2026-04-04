import { motion } from 'framer-motion';
import { sigmoid, tanh, COLORS } from './TanhData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const mapX = (x: number, ox: number) => ox + x * 14;
const mapY = (y: number, oy: number, scale = 50) => oy - y * scale;

export function CurveCompare() {
  const ox = 220; const oy = 80;
  const pts = Array.from({ length: 49 }, (_, i) => -6 + i * 0.25);
  const sigPath = pts.map((x, i) => {
    const sx = mapX(x, ox); const sy = mapY(sigmoid(x), oy);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');
  const tanhPath = pts.map((x, i) => {
    const sx = mapX(x, ox); const sy = mapY(tanh(x), oy, 40);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');
  return (
    <g>
      <line x1={ox - 100} y1={oy} x2={ox + 100} y2={oy}
        stroke="#888" strokeWidth={0.4} />
      <line x1={ox} y1={15} x2={ox} y2={140} stroke="#888" strokeWidth={0.4} />
      <text x={ox - 108} y={mapY(0, oy) + 3} fontSize={9} fill="#888">0</text>
      <text x={ox - 108} y={mapY(1, oy) + 3} fontSize={9}
        fill={COLORS.sigmoid}>1</text>
      <text x={ox + 103} y={mapY(1, oy, 40) + 3} fontSize={9}
        fill={COLORS.tanh}>+1</text>
      <text x={ox + 103} y={mapY(-1, oy, 40) + 3} fontSize={9}
        fill={COLORS.tanh}>-1</text>
      <path d={sigPath} fill="none" stroke={COLORS.sigmoid} strokeWidth={1.2}
        strokeDasharray="4,3" />
      <path d={tanhPath} fill="none" stroke={COLORS.tanh} strokeWidth={1.5} />
      <line x1={50} y1={15} x2={70} y2={15}
        stroke={COLORS.sigmoid} strokeWidth={1.2} strokeDasharray="4,3" />
      <text x={73} y={18} fontSize={9} fill={COLORS.sigmoid}>sigmoid</text>
      <line x1={50} y1={27} x2={70} y2={27}
        stroke={COLORS.tanh} strokeWidth={1.5} />
      <text x={73} y={30} fontSize={9} fill={COLORS.tanh}>tanh</text>
      <text x={ox} y={140} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">
        tanh: 원점 대칭 → zero-centered 출력
      </text>
    </g>
  );
}

export function StraightPath() {
  const zigzag = [
    { x: 350, y: 30 }, { x: 310, y: 80 }, { x: 380, y: 50 },
    { x: 290, y: 110 },
  ];
  const straight = [
    { x: 120, y: 30 }, { x: 105, y: 60 }, { x: 95, y: 85 },
    { x: 90, y: 100 },
  ];
  return (
    <g>
      <line x1={60} y1={75} x2={200} y2={75} stroke="#888" strokeWidth={0.4} />
      <line x1={130} y1={20} x2={130} y2={140} stroke="#888" strokeWidth={0.4} />
      <line x1={260} y1={75} x2={400} y2={75} stroke="#888" strokeWidth={0.4} />
      <line x1={330} y1={20} x2={330} y2={140} stroke="#888" strokeWidth={0.4} />
      <text x={130} y={15} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">tanh (직선)</text>
      <text x={330} y={15} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">sigmoid (지그재그)</text>
      {straight.map((p, i) => {
        if (i === 0) return null;
        return (
          <motion.line key={`s${i}`} x1={straight[i - 1].x} y1={straight[i - 1].y}
            x2={p.x} y2={p.y} stroke={COLORS.path} strokeWidth={1.2}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ ...sp, delay: i * 0.1 }} />
        );
      })}
      <circle cx={90} cy={100} r={3} fill={COLORS.path} />
      {zigzag.map((p, i) => {
        if (i === 0) return null;
        return (
          <motion.line key={`z${i}`} x1={zigzag[i - 1].x} y1={zigzag[i - 1].y}
            x2={p.x} y2={p.y} stroke={COLORS.zigzag} strokeWidth={1.2}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ ...sp, delay: i * 0.1 }} />
        );
      })}
    </g>
  );
}
