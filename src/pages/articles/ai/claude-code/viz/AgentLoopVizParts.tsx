import { motion } from 'framer-motion';

export function Box({ x, y, w, h, color, label, sub }: {
  x: number; y: number; w: number; h: number; color: string; label: string; sub?: string;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={`${color}18`} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle"
        fontSize={9} fontWeight="700" fill={color}>{label}</text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle"
          fontSize={9} fill={color} opacity={0.75}>{sub}</text>
      )}
    </motion.g>
  );
}

export function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <>
      <defs>
        <marker id="arrowhead" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
          <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
        </marker>
      </defs>
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? '5 3' : undefined} markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    </>
  );
}

export function Label({ x, y, text, color }: { x: number; y: number; text: string; color?: string }) {
  return <text x={x} y={y} fontSize={9} fill={color ?? 'var(--muted-foreground)'}>{text}</text>;
}
