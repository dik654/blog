import { motion } from 'framer-motion';
import { C1, C2, C3 } from './EVMStackVizData';

export function CompileStep() {
  return (
    <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Source */}
      <rect x={10} y={12} width={140} height={108} rx={5} fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
      <text x={80} y={8} textAnchor="middle" fontSize={10} fill={C2} fontWeight={600}>Solidity</text>
      <text x={20} y={36} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">function add(</text>
      <text x={20} y={50} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">{'  '}uint a, uint b</text>
      <text x={20} y={64} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">) pure returns(uint)</text>
      <text x={20} y={78} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">{'{'}</text>
      <text x={20} y={92} fontSize={10} fill={C1} fontFamily="monospace" fontWeight={500}>{'  '}return a + b;</text>
      <text x={20} y={106} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">{'}'}</text>

      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <line x1={160} y1={66} x2={212} y2={66} stroke={C3} strokeWidth={1} markerEnd="url(#arrComp)" />
        <rect x={168} y={59} width={32} height={14} rx={3} fill="var(--background)" stroke={C3} strokeWidth={0.5} />
        <text x={184} y={69} textAnchor="middle" fontSize={10} fill={C3} fontWeight={500}>solc</text>
      </motion.g>

      {/* Bytecode */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <rect x={222} y={12} width={246} height={108} rx={5} fill={`${C1}08`} stroke={C1} strokeWidth={0.8} />
        <text x={345} y={8} textAnchor="middle" fontSize={10} fill={C1} fontWeight={600}>EVM Bytecode</text>
        <text x={232} y={40} fontSize={10} fill={C1} fontFamily="monospace" fontWeight={600}>60 03</text>
        <text x={280} y={40} fontSize={10} fill="var(--muted-foreground)">← PUSH1 0x03</text>
        <text x={232} y={60} fontSize={10} fill={C2} fontFamily="monospace" fontWeight={600}>60 05</text>
        <text x={280} y={60} fontSize={10} fill="var(--muted-foreground)">← PUSH1 0x05</text>
        <text x={232} y={80} fontSize={10} fill={C3} fontFamily="monospace" fontWeight={600}>01</text>
        <text x={256} y={80} fontSize={10} fill="var(--muted-foreground)">← ADD</text>
        <line x1={232} y1={92} x2={456} y2={92} stroke="var(--border)" strokeWidth={0.5} />
        <text x={232} y={108} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">
          Raw: 0x6003600501
        </text>
      </motion.g>

      <defs>
        <marker id="arrComp" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C3} />
        </marker>
      </defs>
    </svg>
  );
}

const txFields = [
  { key: 'from', val: '0xAbC...dEf', note: '' },
  { key: 'to', val: '0x000...000', note: '(contract creation)' },
  { key: 'value', val: '0 ETH', note: '' },
  { key: 'data', val: '0x6003600501', note: '← 바이트코드' },
  { key: 'gasLimit', val: '21000+', note: '' },
];

export function TxDataStep() {
  return (
    <svg viewBox="0 0 400 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={200} y={12} textAnchor="middle" fontSize={10} fill={C2} fontWeight={600}>Transaction</text>
      <rect x={60} y={20} width={280} height={128} rx={6} fill={`${C2}06`} stroke={C2} strokeWidth={0.8} />
      {txFields.map((f, i) => {
        const y = 44 + i * 22;
        const isData = f.key === 'data';
        return (
          <motion.g key={f.key} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}>
            {isData && <rect x={64} y={y - 12} width={272} height={18} rx={3} fill={`${C1}10`} />}
            <text x={80} y={y} fontSize={10} fill={isData ? C1 : 'var(--muted-foreground)'}
              fontWeight={isData ? 600 : 400}>{f.key}</text>
            <text x={152} y={y} fontSize={10} fill={isData ? C1 : 'var(--muted-foreground)'}
              fontFamily="monospace" fontWeight={isData ? 600 : 400}>{f.val}</text>
            {f.note && (
              <text x={280} y={y} fontSize={10} fill={isData ? C1 : 'var(--muted-foreground)'}>{f.note}</text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
