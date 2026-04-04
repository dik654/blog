import { motion } from 'framer-motion';
import { C } from './WeightVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const BAR_W = 340;

const SEGS = [
  { label: 'w[r] (부모)', w: 0.4, color: C.parent, idx: 0 },
  { label: 'log₂(P)×2⁸', w: 0.35, color: C.log2, idx: 1 },
  { label: 'WinCount 보너스', w: 0.25, color: C.bonus, idx: 2 },
];

export function StepParent() {
  return <WeightBar activeIdx={0} />;
}

export function StepLog2() {
  return <WeightBar activeIdx={1} />;
}

export function StepBonus() {
  return <WeightBar activeIdx={2} />;
}

function WeightBar({ activeIdx }: { activeIdx: number }) {
  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        w[r+1] = w[r] + log₂(P)×2⁸ + log₂(P)×ΣWinCount×wRatio / e
      </text>
      {SEGS.map((seg) => {
        const prevW = seg.idx === 0 ? 0 : seg.idx === 1 ? 0.4 : 0.75;
        const x = 60 + prevW * BAR_W;
        const w = seg.w * BAR_W;
        const active = activeIdx === seg.idx;
        return (
          <motion.g key={seg.label}
            animate={{ opacity: activeIdx >= seg.idx ? 1 : 0.15 }} transition={sp}>
            <rect x={x} y={35} width={w} height={30} rx={seg.idx === 0 ? 6 : 0}
              fill={active ? `${seg.color}30` : `${seg.color}15`}
              stroke={seg.color} strokeWidth={active ? 2 : 0.8} />
            <text x={x + w / 2} y={55} textAnchor="middle" fontSize={10}
              fontWeight={600} fill={seg.color}>{seg.label}</text>
          </motion.g>
        );
      })}
      {activeIdx >= 1 && (
        <motion.g animate={{ opacity: 0.7 }} initial={{ opacity: 0 }} transition={sp}>
          <text x={60} y={90} fontSize={10} fill={C.log2} fontFamily="monospace">
            log2P = tpow.BitLen() - 1
          </text>
          <text x={60} y={106} fontSize={10} fill={C.log2} fontFamily="monospace">
            out.Add(out, log2P{'<<'}8)
          </text>
        </motion.g>
      )}
      {activeIdx >= 2 && (
        <motion.g animate={{ opacity: 0.7 }} initial={{ opacity: 0 }} transition={sp}>
          <text x={60} y={124} fontSize={10} fill={C.bonus} fontFamily="monospace">
            eWeight = log2P × WRatioNum × totalJ / (e × WRatioDen)
          </text>
        </motion.g>
      )}
    </g>
  );
}
