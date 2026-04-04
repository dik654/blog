import { motion } from 'framer-motion';
import { CV, CE, CA } from './PoseidonVizData';

export function SboxStep() {
  const chain = [
    { label: 'x', w: 50 },
    { label: 'x²', w: 55, op: 'square' },
    { label: 'x⁴', w: 55, op: 'square' },
    { label: 'x⁵', w: 55, op: '× x' },
  ];
  return (
    <g>
      <text x={220} y={15} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        S-box: x → x⁵ (Fp 곱셈 3회)
      </text>
      {chain.map((c, i) => {
        const xPos = 40 + i * 105;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}>
            <rect x={xPos} y={40} width={c.w} height={36} rx={4}
              fill={i === 3 ? `${CE}15` : `${CV}10`}
              stroke={i === 3 ? CE : CV} strokeWidth={1} />
            <text x={xPos + c.w / 2} y={62} textAnchor="middle"
              fontSize={10} fontWeight={600} fill={i === 3 ? CE : CV}>{c.label}</text>
            {c.op && (
              <text x={xPos - 18} y={62} textAnchor="middle"
                fontSize={8} fill={CA}>{c.op}</text>
            )}
          </motion.g>
        );
      })}
      <motion.text x={220} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        gcd(5, r-1) = 1 → x⁵ 함수가 역원 존재하는 순열
      </motion.text>
    </g>
  );
}

export function MDSStep() {
  const mds = [[2, 1, 1], [1, 2, 1], [1, 1, 2]];
  return (
    <g>
      <text x={220} y={15} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        MDS 행렬 곱: result = M · state
      </text>
      {mds.map((row, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15 }}>
          {row.map((v, j) => (
            <rect key={j} x={130 + j * 40} y={28 + i * 32} width={35} height={28} rx={3}
              fill={v === 2 ? `${CV}15` : `${CE}08`}
              stroke={v === 2 ? CV : CE} strokeWidth={0.8} />
          ))}
          {row.map((v, j) => (
            <text key={`t-${j}`} x={147 + j * 40} y={46 + i * 32} textAnchor="middle"
              fontSize={10} fontWeight={600} fill={v === 2 ? CV : CE}>{v}</text>
          ))}
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={290} y={60} fontSize={8} fill="var(--muted-foreground)">모든 부분행렬</text>
        <text x={290} y={72} fontSize={8} fill="var(--muted-foreground)">det != 0</text>
        <text x={290} y={84} fontSize={8} fill={CA}>→ 최대 확산</text>
      </motion.g>
    </g>
  );
}
