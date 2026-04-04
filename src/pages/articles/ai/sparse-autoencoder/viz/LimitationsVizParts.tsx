import { motion } from 'framer-motion';

export function LayerRow({ ids, color, border, C }: {
  ids: number[]; color: string; border: string;
  C: Record<string, string>;
}) {
  return (
    <>
      {ids.map((i) => (
        <g key={i}>
          <rect x={40 + i * 60} y={35} width={50} height={30} rx={5}
            fill={color} stroke={border} strokeWidth={1.2} />
          <text x={65 + i * 60} y={54} textAnchor="middle"
            fontSize={9} fill={C.muted}>L{i + 1}</text>
        </g>
      ))}
    </>
  );
}

export function LayerLinks({ count, color }: {
  count: number; color: string;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <motion.line key={i}
          x1={90 + i * 60} y1={50} x2={100 + i * 60} y2={50}
          stroke={color} strokeWidth={1.5}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }} />
      ))}
    </>
  );
}
