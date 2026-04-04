import { motion } from 'framer-motion';

interface Card {
  label: string; num: string; unit: string; desc: string; color: string; x: number;
}

export default function BiasOverview({ cards, sp }: { cards: Card[]; sp: object }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {cards.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={15} width={130} height={80} rx={8}
            fill={`${b.color}10`} stroke={b.color} strokeWidth={1} />
          <text x={b.x + 65} y={38} textAnchor="middle"
            fontSize={11} fontWeight={700} fill={b.color}>{b.label}</text>
          <text x={b.x + 65} y={62} textAnchor="middle"
            fontSize={20} fontWeight={800} fill={b.color}>{b.num}</text>
          <text x={b.x + 65} y={76} textAnchor="middle"
            fontSize={10} fill="var(--muted-foreground)">{b.unit}</text>
          <text x={b.x + 65} y={88} textAnchor="middle"
            fontSize={9} fill={b.color}>{b.desc}</text>
        </g>
      ))}
      <line x1={20} y1={115} x2={470} y2={115} stroke="var(--border)" strokeWidth={1} />
      <rect x={50} y={108} width={60} height={14} rx={3}
        fill="#3b82f620" stroke="#3b82f6" strokeWidth={0.8} />
      <text x={80} y={118} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="#3b82f6">CNN</text>
      <rect x={340} y={108} width={80} height={14} rx={3}
        fill="#ef444420" stroke="#ef4444" strokeWidth={0.8} />
      <text x={380} y={118} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="#ef4444">Transformer</text>
      <text x={20} y={135} fontSize={9} fill="var(--muted-foreground)">
        높은 편향 (강한 가정)
      </text>
      <text x={470} y={135} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
        높은 분산 (자유 표현)
      </text>
    </motion.g>
  );
}
