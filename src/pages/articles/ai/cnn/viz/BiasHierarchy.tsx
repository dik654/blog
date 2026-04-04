import { motion } from 'framer-motion';

interface Layer {
  layer: string; rf: number; color: string; x: number;
}

export default function BiasHierarchy({ layers, sp }: { layers: Layer[]; sp: object }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={250} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="#f59e0b">수용야 확장: 층이 깊을수록 넓은 영역 참조</text>
      {layers.map((l, idx) => (
        <g key={idx}>
          <text x={l.x + 50} y={32} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={l.color}>{l.layer}</text>
          {Array.from({ length: 7 }, (_, r) =>
            Array.from({ length: 7 }, (_, c) => {
              const inRf = r < l.rf && c < l.rf;
              const center = r === Math.floor(l.rf / 2) && c === Math.floor(l.rf / 2);
              return (
                <rect key={`${idx}-${r}-${c}`}
                  x={l.x + c * 10 + (70 - 7 * 10) / 2}
                  y={38 + r * 10}
                  width={9} height={9} rx={1}
                  fill={center ? `${l.color}60` : inRf ? `${l.color}25` : '#80808008'}
                  stroke={inRf ? l.color : '#94a3b830'}
                  strokeWidth={center ? 1.5 : inRf ? 0.5 : 0.2} />
              );
            })
          )}
          <text x={l.x + 50} y={120} textAnchor="middle" fontSize={10}
            fontWeight={700} fill={l.color}>
            {l.rf}×{l.rf} = {l.rf * l.rf} px
          </text>
        </g>
      ))}
      {[0, 1].map(i => (
        <g key={`ar${i}`}>
          <line x1={[80, 220][i]} y1={75} x2={[130, 270][i]} y2={75}
            stroke="var(--muted-foreground)" strokeWidth={0.8} />
          <text x={[105, 245][i]} y={72} textAnchor="middle" fontSize={8}
            fill="var(--muted-foreground)">+Conv</text>
        </g>
      ))}
      <rect x={380} y={35} width={115} height={60} rx={6}
        fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
      <text x={437} y={52} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="var(--foreground)">수용야 공식</text>
      <text x={437} y={68} textAnchor="middle" fontSize={10}
        fill="#f59e0b" fontWeight={600}>RF = 1 + L×(K-1)</text>
      <text x={437} y={82} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">L=3, K=3 → RF=7</text>
    </motion.g>
  );
}
