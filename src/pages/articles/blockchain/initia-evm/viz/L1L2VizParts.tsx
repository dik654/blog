import { motion } from 'framer-motion';
import { C } from './L1L2VizData';

export function L1Box({ highlight }: { highlight: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <rect x={100} y={10} width={200} height={55} rx={8}
        fill={highlight ? `${C.l1}22` : `${C.l1}11`}
        stroke={C.l1} strokeWidth={highlight ? 2.5 : 1.5} />
      <text x={200} y={32} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.l1}>
        Initia L1
      </text>
      <text x={200} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        Cosmos SDK + MoveVM + IBC Hub
      </text>
    </motion.g>
  );
}

export function BridgeLabel({ show }: { show: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0.2 }}
      transition={{ duration: 0.3 }}
    >
      <rect x={155} y={75} width={90} height={22} rx={4}
        fill={show ? `${C.bridge}22` : `${C.bridge}08`}
        stroke={C.bridge} strokeWidth={show ? 1.5 : 0.5} />
      <text x={200} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bridge}>
        OPinit Bridge
      </text>
    </motion.g>
  );
}

export function L2Box({ x, label, vm, color, highlight, delay }: {
  x: number; label: string; vm: string; color: string; highlight: boolean; delay: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <motion.line
        x1={200} y1={65} x2={x + 55} y2={110}
        stroke={highlight ? color : 'var(--border)'}
        strokeWidth={highlight ? 1.5 : 1}
        strokeDasharray={highlight ? 'none' : '3 2'}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      />
      <rect x={x} y={110} width={110} height={50} rx={8}
        fill={highlight ? `${color}22` : `${color}11`}
        stroke={color} strokeWidth={highlight ? 2.5 : 1.5} />
      <text x={x + 55} y={132} textAnchor="middle" fontSize={10} fontWeight={600} fill={color}>
        {label}
      </text>
      <text x={x + 55} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        {vm}
      </text>
    </motion.g>
  );
}

export function LiquidityLayer({ show }: { show: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0.15 }}
      transition={{ duration: 0.4 }}
    >
      <rect x={30} y={175} width={340} height={24} rx={6}
        fill={show ? `${C.l1}15` : `${C.l1}05`}
        stroke={C.l1} strokeWidth={show ? 1.5 : 0.5} strokeDasharray="4 2" />
      <text x={200} y={191} textAnchor="middle" fontSize={9} fontWeight={600}
        fill={show ? C.l1 : 'var(--muted-foreground)'}>
        Enshrined Liquidity Pool
      </text>
    </motion.g>
  );
}
