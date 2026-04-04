import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './PipelineVizData';

const stages = [
  { label: 'Headers', color: C.hdr },
  { label: 'Bodies', color: C.body },
  { label: 'Senders', color: C.send },
  { label: 'Execution', color: C.exec },
  { label: 'Merkle', color: C.merkle },
];

/* Step 0: 전체 루프 — 5개 Stage가 순서대로 실행되는 루프 표현 */
export function StepLoop() {
  return (<g>
    <defs><marker id="pl" markerWidth={5} markerHeight={4} refX={4} refY={2} orient="auto">
      <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.6} /></marker></defs>
    {stages.map((s, i) => (
      <motion.g key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <ModuleBox x={8 + i * 82} y={35} w={72} h={42} label={s.label} color={s.color} />
        {i < 4 && <line x1={80 + i * 82} y1={56} x2={90 + i * 82} y2={56}
          stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#pl)" />}
      </motion.g>
    ))}
    {/* 루프 화살표 — 마지막에서 처음으로 돌아감 */}
    <motion.path d="M 410 77 Q 420 105 210 110 Q 5 105 5 77 L 5 56 L 8 56"
      fill="none" stroke="var(--muted-foreground)" strokeWidth={0.7} strokeDasharray="3 2"
      markerEnd="url(#pl)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }} />
    <text x={210} y={125} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      done=false → 다음 루프에서 계속
    </text>
  </g>);
}

/* Step 1: Headers — 피어에서 헤더가 날아오는 장면 */
export function StepHeaders() {
  const peers = [{ x: 20, y: 20 }, { x: 20, y: 60 }, { x: 20, y: 100 }];
  return (<g>
    <defs><marker id="ph" markerWidth={5} markerHeight={4} refX={4} refY={2} orient="auto">
      <path d="M0,0 L5,2 L0,4" fill={C.hdr} /></marker></defs>
    {peers.map((p, i) => (
      <g key={i}>
        <circle cx={p.x} cy={p.y} r={10} fill="var(--card)" stroke={C.hdr} strokeWidth={0.8} />
        <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fill={C.hdr}>P{i + 1}</text>
        <motion.line x1={p.x + 12} y1={p.y} x2={120} y2={60}
          stroke={C.hdr} strokeWidth={0.8} markerEnd="url(#ph)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.15, duration: 0.4 }} />
      </g>
    ))}
    {/* 헤더가 쌓이는 DB */}
    {[0, 1, 2, 3].map(i => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.12 }}>
        <rect x={130 + i * 55} y={45} width={45} height={30} rx={4} fill="var(--card)" />
        <rect x={130 + i * 55} y={45} width={45} height={30} rx={4}
          fill={`${C.hdr}12`} stroke={C.hdr} strokeWidth={0.6} />
        <text x={152 + i * 55} y={57} textAnchor="middle" fontSize={10} fill={C.hdr}>H#{i}</text>
        <text x={152 + i * 55} y={69} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">검증 ✓</text>
      </motion.g>
    ))}
  </g>);
}

/* Step 2: Bodies — 헤더의 TxRoot와 바디의 DeriveSha를 대조 */
export function StepBodies() {
  return (<g>
    {[0, 1, 2].map(i => {
      const x = 10 + i * 140;
      return (<g key={i}>
        {/* 헤더 — TxRoot 값 표시 */}
        <rect x={x} y={8} width={120} height={28} rx={4} fill="var(--card)" />
        <rect x={x} y={8} width={120} height={28} rx={4}
          fill={`${C.hdr}10`} stroke={C.hdr} strokeWidth={0.6} />
        <text x={x + 60} y={20} textAnchor="middle" fontSize={10} fill={C.hdr}>Header #{i}</text>
        <text x={x + 60} y={30} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">TxRoot: 0x8f2a...</text>
        {/* 대조 기호 */}
        <motion.text x={x + 60} y={46} textAnchor="middle" fontSize={11}
          fill={C.done} initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: i * 0.2 + 0.5, type: 'spring' }}>
          ==
        </motion.text>
        {/* 바디 — DeriveSha 계산값 표시 */}
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 + 0.3, type: 'spring' }}>
          <rect x={x} y={52} width={120} height={38} rx={4} fill="var(--card)" />
          <rect x={x} y={52} width={120} height={38} rx={4}
            fill={`${C.body}10`} stroke={C.body} strokeWidth={0.6} />
          <text x={x + 60} y={65} textAnchor="middle" fontSize={10} fill={C.body}>Body: TX₀ TX₁ TX₂</text>
          <text x={x + 60} y={77} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">DeriveSha: 0x8f2a...</text>
          <motion.text x={x + 60} y={100} textAnchor="middle" fontSize={11} fill={C.done}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2 + 0.7 }}>✓ 일치</motion.text>
        </motion.g>
      </g>);
    })}
    <text x={210} y={105} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      헤더의 TxRoot와 바디의 TX 해시를 대조해 짝지음
    </text>
  </g>);
}
