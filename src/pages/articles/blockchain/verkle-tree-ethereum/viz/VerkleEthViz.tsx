import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  {
    label: 'Step 1: 현재 MPT — 큰 Witness 크기',
    body: 'Merkle Patricia Trie는 분기 계수가 16으로 증명 경로가 넓습니다. 하나의 키-값 접근에 ~4KB의 증명이 필요하여 stateless client 구현이 비현실적입니다.',
  },
  {
    label: 'Step 2: Verkle Tree — 컴팩트한 Witness',
    body: 'Verkle Tree는 분기 계수 256에서도 ~150 bytes의 증명을 제공합니다. IPA 기반 벡터 커밋먼트 덕분에 증명 크기가 분기 계수에 독립적입니다.',
  },
  {
    label: 'Step 3: Stateless Client — 블록 + Witness로 검증',
    body: 'Stateless client는 전체 상태 DB 없이도 블록에 첨부된 witness만으로 트랜잭션을 검증합니다. 노드 운영 진입 장벽이 크게 낮아집니다.',
  },
  {
    label: 'Step 4: 로드맵 — Pectra → Fusaka → Hegota',
    body: 'The Verge 로드맵에 따라 Verkle Tree는 Hegota 업그레이드(2026 H2 예정)에서 메인넷에 도입될 계획입니다. Kaustinen 테스트넷에서 검증 중입니다.',
  },
];

function Box({ x, y, w, h, label, sub, color, delay = 0 }: {
  x: number; y: number; w: number; h: number; label: string; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={`${color}18`} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 4)} textAnchor="middle" fontSize={9} fontWeight="700" fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">{sub}</text>}
    </motion.g>
  );
}

function TreeNode({ cx, cy, r, color, label, delay = 0 }: {
  cx: number; cy: number; r: number; color: string; label?: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay }}>
      <circle cx={cx} cy={cy} r={r} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      {label && <text x={cx} y={cy + 3} textAnchor="middle" fontSize={7} fontWeight="600" fill={color}>{label}</text>}
    </motion.g>
  );
}

function Line({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} opacity={0.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, delay }} />
  );
}

function Step0() {
  // MPT with branching factor 16
  const root = { x: 190, y: 20 };
  const children = [
    { x: 90, y: 60 }, { x: 140, y: 60 }, { x: 190, y: 60 },
    { x: 240, y: 60 }, { x: 290, y: 60 },
  ];
  const leaves = [
    { x: 60, y: 100 }, { x: 90, y: 100 }, { x: 120, y: 100 },
    { x: 150, y: 100 }, { x: 180, y: 100 }, { x: 210, y: 100 },
    { x: 240, y: 100 }, { x: 270, y: 100 }, { x: 300, y: 100 },
    { x: 320, y: 100 },
  ];
  return (
    <g>
      <TreeNode cx={root.x} cy={root.y} r={12} color={C.orange} label="root" />
      {children.map((c, i) => (
        <g key={i}>
          <Line x1={root.x} y1={root.y + 12} x2={c.x} y2={c.y - 8} color={C.orange} delay={i * 0.05} />
          <TreeNode cx={c.x} cy={c.y} r={8} color={C.orange} delay={i * 0.05} />
        </g>
      ))}
      {leaves.map((l, i) => (
        <g key={`l-${i}`}>
          <Line x1={children[Math.floor(i / 2)].x} y1={children[Math.floor(i / 2)].y + 8} x2={l.x} y2={l.y - 6} color={C.orange} delay={0.3 + i * 0.03} />
          <TreeNode cx={l.x} cy={l.y} r={6} color={C.orange} delay={0.3 + i * 0.03} />
        </g>
      ))}
      <text x={190} y={130} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">MPT (branching=16)</text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={110} y={138} width={160} height={20} rx={4} fill="#ef444418" stroke="#ef4444" strokeWidth={1} />
        <text x={190} y={152} textAnchor="middle" fontSize={8} fontWeight="700" fill="#ef4444">Witness: ~4KB per access</text>
      </motion.g>
    </g>
  );
}

function Step1() {
  // Verkle tree with compact proofs
  const root = { x: 190, y: 20 };
  const children = [
    { x: 60, y: 55 }, { x: 120, y: 55 }, { x: 180, y: 55 },
    { x: 240, y: 55 }, { x: 300, y: 55 },
  ];
  const leaves: { x: number; y: number }[] = [];
  children.forEach(c => {
    for (let j = -12; j <= 12; j += 8) {
      leaves.push({ x: c.x + j, y: 95 });
    }
  });
  return (
    <g>
      <TreeNode cx={root.x} cy={root.y} r={12} color={C.green} label="root" />
      {children.map((c, i) => (
        <g key={i}>
          <Line x1={root.x} y1={root.y + 12} x2={c.x} y2={c.y - 8} color={C.green} delay={i * 0.05} />
          <TreeNode cx={c.x} cy={c.y} r={8} color={C.green} delay={i * 0.05} />
        </g>
      ))}
      {leaves.map((l, i) => (
        <g key={`l-${i}`}>
          <Line x1={children[Math.floor(i / 4)].x} y1={children[Math.floor(i / 4)].y + 8} x2={l.x} y2={l.y - 5} color={C.green} delay={0.3 + i * 0.02} />
          <circle cx={l.x} cy={l.y} r={4} fill={`${C.green}33`} stroke={C.green} strokeWidth={1} />
        </g>
      ))}
      <text x={190} y={118} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">Verkle Tree (branching=256)</text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={100} y={126} width={180} height={20} rx={4} fill={`${C.green}18`} stroke={C.green} strokeWidth={1} />
        <text x={190} y={140} textAnchor="middle" fontSize={8} fontWeight="700" fill={C.green}>Witness: ~150 bytes per access</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={190} y={158} textAnchor="middle" fontSize={7} fill={C.purple}>IPA (Inner Product Argument) 기반 벡터 커밋먼트</text>
      </motion.g>
    </g>
  );
}

function Step2() {
  return (
    <g>
      {/* Block producer */}
      <Box x={10} y={15} w={100} h={40} label="Block Producer" sub="Full Node" color={C.blue} />

      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={110} y1={35} x2={155} y2={35} stroke={C.blue} strokeWidth={1.5} opacity={0.5} />
        <polygon points="155,31 165,35 155,39" fill={C.blue} opacity={0.5} />
      </motion.g>

      {/* Block + Witness bundle */}
      <Box x={165} y={5} w={80} h={25} label="Block" color={C.orange} delay={0.3} />
      <Box x={165} y={35} w={80} h={25} label="Witness" sub="~150B/access" color={C.green} delay={0.35} />

      {/* Arrow to stateless client */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={245} y1={35} x2={275} y2={35} stroke={C.green} strokeWidth={1.5} opacity={0.5} />
        <polygon points="275,31 285,35 275,39" fill={C.green} opacity={0.5} />
      </motion.g>

      {/* Stateless client */}
      <Box x={285} y={15} w={95} h={40} label="Stateless Client" sub="No State DB" color={C.purple} delay={0.5} />

      {/* Verification result */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x={295} y={65} width={75} height={22} rx={4} fill={`${C.green}18`} stroke={C.green} strokeWidth={1} />
        <text x={332} y={80} textAnchor="middle" fontSize={8} fontWeight="700" fill={C.green}>Verified</text>
      </motion.g>

      {/* Comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <text x={55} y={80} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">State DB: 수백 GB</text>
        <text x={332} y={100} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">State DB: 불필요</text>
      </motion.g>
    </g>
  );
}

function Step3() {
  const milestones = [
    { x: 40, label: 'Pectra', sub: '2025', color: C.blue, done: true },
    { x: 140, label: 'Fusaka', sub: '2025-26', color: C.orange, done: false },
    { x: 250, label: 'Hegota', sub: '2026 H2', color: C.green, done: false },
    { x: 340, label: 'Full VKT', sub: 'Future', color: C.purple, done: false },
  ];
  return (
    <g>
      {/* Timeline line */}
      <motion.line x1={30} y1={50} x2={360} y2={50}
        stroke="hsl(var(--muted-foreground))" strokeWidth={2} opacity={0.3}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }} />

      {milestones.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 + 0.3 }}>
          <circle cx={m.x} cy={50} r={8} fill={m.done ? m.color : `${m.color}33`} stroke={m.color} strokeWidth={2} />
          {m.done && <text x={m.x} y={53} textAnchor="middle" fontSize={8} fontWeight="700" fill="white">&#10003;</text>}
          <text x={m.x} y={30} textAnchor="middle" fontSize={9} fontWeight="700" fill={m.color}>{m.label}</text>
          <text x={m.x} y={72} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">{m.sub}</text>
        </motion.g>
      ))}

      {/* The Verge label */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <rect x={120} y={85} width={150} height={22} rx={4} fill={`${C.purple}18`} stroke={C.purple} strokeWidth={1} />
        <text x={195} y={100} textAnchor="middle" fontSize={8} fontWeight="700" fill={C.purple}>The Verge — Stateless Ethereum</text>
      </motion.g>

      {/* Kaustinen testnet */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <text x={195} y={125} textAnchor="middle" fontSize={7} fill={C.green}>Kaustinen testnet 검증 진행 중</text>
      </motion.g>
    </g>
  );
}

export default function VerkleEthViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 390 170" className="w-full max-w-[500px]" style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </svg>
      )}
    </StepViz>
  );
}
