import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const WEIGHTS = [
  { w: 3.2, penalty: 10.24, color: '#ef4444' },
  { w: 0.5, penalty: 0.25, color: '#10b981' },
  { w: -2.1, penalty: 4.41, color: '#f59e0b' },
  { w: 0.3, penalty: 0.09, color: '#10b981' },
];

export default function RegWeightDecay() {
  return (
    <motion.g initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={sp}>
      <text x={20} y={20} fontSize={9} fontWeight={600}
        fill="var(--foreground)">
        L2 정규화: L_total = L + λ·Σwᵢ²
      </text>
      <text x={20} y={34} fontSize={8}
        fill="var(--muted-foreground)">
        λ = 0.01 (패널티 강도)
      </text>

      {/* weight penalty table */}
      <text x={30} y={55} fontSize={8} fontWeight={600}
        fill="var(--muted-foreground)">가중치</text>
      <text x={110} y={55} fontSize={8} fontWeight={600}
        fill="var(--muted-foreground)">w²</text>
      <text x={180} y={55} fontSize={8} fontWeight={600}
        fill="var(--muted-foreground)">패널티</text>
      <text x={260} y={55} fontSize={8} fontWeight={600}
        fill="var(--muted-foreground)">크기</text>
      <line x1={20} y1={58} x2={350} y2={58}
        stroke="var(--border)" strokeWidth={0.4} />

      {WEIGHTS.map((w, i) => {
        const ry = 68 + i * 16;
        const barW = w.penalty / 10.24 * 70;
        return (
          <g key={i}>
            <text x={30} y={ry} fontSize={8}
              fill={w.color} fontWeight={500}>
              w={w.w}
            </text>
            <text x={110} y={ry} fontSize={8}
              fill="var(--foreground)">
              {w.penalty.toFixed(2)}
            </text>
            <text x={180} y={ry} fontSize={8}
              fill="var(--foreground)">
              {(w.penalty * 0.01).toFixed(4)}
            </text>
            <rect x={260} y={ry - 9} width={barW} height={10}
              rx={2} fill={`${w.color}30`} stroke={w.color}
              strokeWidth={0.6} />
          </g>
        );
      })}

      <rect x={20} y={120} width={340} height={20} rx={4}
        fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={0.6} />
      <text x={190} y={133} textAnchor="middle" fontSize={8}
        fontWeight={600} fill="#8b5cf6">
        큰 가중치(3.2)의 패널티가 작은 가중치(0.3)의 40배 → 자연스럽게 축소
      </text>
    </motion.g>
  );
}
