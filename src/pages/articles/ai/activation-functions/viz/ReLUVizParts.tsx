import { motion } from 'framer-motion';
import { COLORS } from './ReLUData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export function ReLUGraph() {
  const ox = 220; const oy = 90;
  return (
    <g>
      <line x1={ox - 100} y1={oy} x2={ox + 100} y2={oy}
        stroke="#888" strokeWidth={0.4} />
      <line x1={ox} y1={20} x2={ox} y2={140} stroke="#888" strokeWidth={0.4} />
      <line x1={ox - 100} y1={oy} x2={ox} y2={oy}
        stroke={COLORS.relu} strokeWidth={1.5} />
      <line x1={ox} y1={oy} x2={ox + 80} y2={oy - 80}
        stroke={COLORS.relu} strokeWidth={1.5} />
      <text x={ox - 60} y={oy - 8} fontSize={9} fill={COLORS.dead}>f'=0</text>
      <text x={ox + 50} y={oy - 50} fontSize={9} fill={COLORS.alive}>f'=1</text>
      <text x={ox} y={14} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">f(x) = max(0, x)</text>
      <circle cx={ox} cy={oy} r={3} fill={COLORS.relu} />
    </g>
  );
}

export function GradientCompare() {
  const layers = [1, 2, 3, 4, 5];
  const sigVals = layers.map(l => Math.pow(0.25, l));
  const barW = 28; const base = 130;
  return (
    <g>
      <text x={220} y={14} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">5층 기울기 전파 비교</text>
      {layers.map((l, i) => {
        const bx = 50 + i * 86;
        const sh = Math.max(2, sigVals[i] * 80 / 0.25);
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={bx} y={base - sh} width={barW} height={sh} rx={2}
              fill={COLORS.sigmoid} />
            <text x={bx + barW / 2} y={base - sh - 3} textAnchor="middle"
              fontSize={9} fill={COLORS.sigmoid}>
              {sigVals[i] < 0.01 ? sigVals[i].toExponential(0) : sigVals[i].toFixed(2)}
            </text>
            <rect x={bx + barW + 4} y={base - 80} width={barW} height={80}
              rx={2} fill={COLORS.relu} opacity={0.7} />
            <text x={bx + barW + 4 + barW / 2} y={base - 83}
              textAnchor="middle" fontSize={9} fill={COLORS.relu}>1</text>
            <text x={bx + barW + 2} y={base + 12} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)">{l}층</text>
          </motion.g>
        );
      })}
      <rect x={30} y={20} width={10} height={8} rx={1} fill={COLORS.sigmoid} />
      <text x={44} y={27} fontSize={9} fill={COLORS.sigmoid}>sigmoid</text>
      <rect x={100} y={20} width={10} height={8} rx={1}
        fill={COLORS.relu} opacity={0.7} />
      <text x={114} y={27} fontSize={9} fill={COLORS.relu}>ReLU</text>
    </g>
  );
}

export function DyingReLU() {
  const neurons = Array.from({ length: 12 }, (_, i) => ({
    x: 60 + (i % 4) * 100,
    y: 35 + Math.floor(i / 4) * 40,
    dead: [1, 3, 5, 8, 10].includes(i),
  }));
  return (
    <g>
      <text x={220} y={14} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">
        Dying ReLU — 12개 뉴런 중 5개 사망
      </text>
      {neurons.map((n, i) => (
        <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ ...sp, delay: i * 0.04 }}>
          <circle cx={n.x} cy={n.y} r={14}
            fill={n.dead ? '#ef444420' : '#10b98120'}
            stroke={n.dead ? COLORS.dead : COLORS.alive}
            strokeWidth={1.2} />
          <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize={9}
            fill={n.dead ? COLORS.dead : COLORS.alive} fontWeight={500}>
            {n.dead ? '0' : 'x'}
          </text>
          {n.dead && (
            <text x={n.x} y={n.y + 20} textAnchor="middle" fontSize={9}
              fill={COLORS.dead}>dead</text>
          )}
        </motion.g>
      ))}
      <text x={220} y={145} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">
        학습률이 크면 뉴런의 ~40%가 비활성화될 수 있음
      </text>
    </g>
  );
}
