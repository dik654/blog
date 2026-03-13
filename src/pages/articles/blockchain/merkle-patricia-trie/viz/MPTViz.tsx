import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  { label: 'Step 1: 단순 Key-Value Store', body: '키-값 쌍을 단순히 저장합니다. 조회에 O(n) 시간이 필요하며, 무결성 검증 기능이 없습니다.' },
  { label: 'Step 2: Patricia Trie — 접두사 압축', body: '공유 접두사를 Extension 노드로 압축하여 공간을 절약합니다. O(log n) 조회가 가능합니다.' },
  { label: 'Step 3: Merkle 해싱 추가', body: '각 노드에 암호학적 해시를 적용하여 변조 감지가 가능합니다. 자식 해시가 부모에 포함됩니다.' },
  { label: 'Step 4: Block Header에 Root Hash 포함', body: 'MPT의 루트 해시가 블록 헤더의 stateRoot에 포함되어 전체 상태의 무결성을 보장합니다.' },
];

function Box({ x, y, label, color, show, width = 60, height = 26 }: {
  x: number; y: number; label: string; color: string; show: boolean; width?: number; height?: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.35 }}
    >
      <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx={5}
        fill={`${color}18`} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={9} fontWeight="600" fill={color}>
        {label}
      </text>
    </motion.g>
  );
}

function Edge({ x1, y1, x2, y2, color, show, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; show: boolean; delay?: number;
}) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5}
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 0.6 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay }}
    />
  );
}

function KVStep() {
  const pairs = [
    { k: 'a711355', v: '45 ETH' },
    { k: 'a77d337', v: '1.0 ETH' },
    { k: 'a7f9365', v: '1.1 ETH' },
    { k: 'a77d397', v: '0.12 ETH' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {pairs.map((p, i) => (
        <g key={i}>
          <rect x={40} y={30 + i * 42} width={130} height={28} rx={5}
            fill={`${C.blue}18`} stroke={C.blue} strokeWidth={1.2} />
          <text x={105} y={48 + i * 42} textAnchor="middle" fontSize={9} fontWeight="600" fill={C.blue}>
            {p.k}
          </text>
          <motion.line x1={175} y1={44 + i * 42} x2={220} y2={44 + i * 42}
            stroke={C.blue} strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
          <rect x={225} y={30 + i * 42} width={80} height={28} rx={5}
            fill={`${C.green}18`} stroke={C.green} strokeWidth={1.2} />
          <text x={265} y={48 + i * 42} textAnchor="middle" fontSize={9} fontWeight="600" fill={C.green}>
            {p.v}
          </text>
        </g>
      ))}
      <text x={195} y={220} textAnchor="middle" fontSize={8} fill={C.blue} opacity={0.6}>
        O(n) lookup — 순차 검색
      </text>
    </motion.g>
  );
}

function PatriciaStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Root extension: shared prefix "a7" */}
      <Box x={195} y={30} label="Ext: a7" color={C.purple} show width={70} />
      {/* Branch node */}
      <Box x={195} y={80} label="Branch [16]" color={C.blue} show width={80} />
      <Edge x1={195} y1={43} x2={195} y2={67} color={C.purple} show />
      {/* Left branch: slot 1 */}
      <Box x={100} y={130} label="Ext: 1355" color={C.purple} show width={70} />
      <Edge x1={195} y1={93} x2={100} y2={117} color={C.blue} show delay={0.05} />
      <Box x={100} y={180} label="45 ETH" color={C.green} show width={60} />
      <Edge x1={100} y1={143} x2={100} y2={167} color={C.purple} show delay={0.1} />
      {/* Mid branch: slot 7 → branch */}
      <Box x={210} y={130} label="Ext: d3" color={C.purple} show width={60} />
      <Edge x1={195} y1={93} x2={210} y2={117} color={C.blue} show delay={0.05} />
      <Box x={175} y={180} label="Leaf: 37" color={C.orange} show width={62} />
      <Box x={250} y={180} label="Leaf: 97" color={C.orange} show width={62} />
      <Edge x1={210} y1={143} x2={175} y2={167} color={C.purple} show delay={0.1} />
      <Edge x1={210} y1={143} x2={250} y2={167} color={C.purple} show delay={0.1} />
      {/* Right branch: slot f */}
      <Box x={330} y={130} label="Leaf: f9365" color={C.orange} show width={72} />
      <Edge x1={195} y1={93} x2={330} y2={117} color={C.blue} show delay={0.05} />
      <text x={195} y={220} textAnchor="middle" fontSize={8} fill={C.purple} opacity={0.6}>
        O(log n) lookup — 공유 접두사 압축
      </text>
    </motion.g>
  );
}

function MerkleStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box x={195} y={30} label="Ext: a7" color={C.purple} show width={70} />
      <Box x={195} y={80} label="Branch [16]" color={C.blue} show width={80} />
      <Edge x1={195} y1={43} x2={195} y2={67} color={C.purple} show />
      <Box x={100} y={130} label="H: 0x3f..a2" color={C.green} show width={78} />
      <Edge x1={195} y1={93} x2={100} y2={117} color={C.blue} show delay={0.05} />
      <Box x={210} y={130} label="H: 0x7c..e1" color={C.green} show width={78} />
      <Edge x1={195} y1={93} x2={210} y2={117} color={C.blue} show delay={0.05} />
      <Box x={330} y={130} label="H: 0xb8..d4" color={C.green} show width={78} />
      <Edge x1={195} y1={93} x2={330} y2={117} color={C.blue} show delay={0.05} />
      {/* Hash propagation arrows */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={195} y={178} textAnchor="middle" fontSize={9} fontWeight="600" fill={C.orange}>
          keccak256(child) → parent
        </text>
        <text x={195} y={198} textAnchor="middle" fontSize={8} fill={C.green} opacity={0.7}>
          자식 노드의 해시가 부모 노드에 포함
        </text>
        <text x={195} y={220} textAnchor="middle" fontSize={8} fill={C.orange} opacity={0.6}>
          변조 시 루트 해시까지 전파 → 즉시 감지
        </text>
      </motion.g>
    </motion.g>
  );
}

function BlockHeaderStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Block header */}
      <rect x={105} y={10} width={180} height={90} rx={8}
        fill={`${C.orange}12`} stroke={C.orange} strokeWidth={1.5} />
      <text x={195} y={28} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.orange}>
        Block Header
      </text>
      <text x={195} y={48} textAnchor="middle" fontSize={8} fill={C.orange} opacity={0.8}>
        parentHash, timestamp, ...
      </text>
      <rect x={125} y={58} width={140} height={20} rx={4}
        fill={`${C.green}22`} stroke={C.green} strokeWidth={1} />
      <text x={195} y={72} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.green}>
        stateRoot: 0x5d..f3
      </text>
      {/* Arrow down to trie */}
      <Edge x1={195} y1={100} x2={195} y2={120} color={C.green} show />
      {/* Simplified trie */}
      <Box x={195} y={135} label="MPT Root" color={C.green} show width={70} />
      <Box x={120} y={185} label="Ext" color={C.purple} show width={50} />
      <Box x={195} y={185} label="Branch" color={C.blue} show width={55} />
      <Box x={270} y={185} label="Leaf" color={C.orange} show width={50} />
      <Edge x1={195} y1={148} x2={120} y2={172} color={C.green} show delay={0.1} />
      <Edge x1={195} y1={148} x2={195} y2={172} color={C.green} show delay={0.15} />
      <Edge x1={195} y1={148} x2={270} y2={172} color={C.green} show delay={0.2} />
      <text x={195} y={220} textAnchor="middle" fontSize={8} fill={C.green} opacity={0.6}>
        루트 해시 하나로 전체 상태의 무결성 보장
      </text>
    </motion.g>
  );
}

export default function MPTViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 390 235" className="w-full max-w-[460px]" style={{ height: 'auto' }}>
          {step === 0 && <KVStep />}
          {step === 1 && <PatriciaStep />}
          {step === 2 && <MerkleStep />}
          {step === 3 && <BlockHeaderStep />}
        </svg>
      )}
    </StepViz>
  );
}
