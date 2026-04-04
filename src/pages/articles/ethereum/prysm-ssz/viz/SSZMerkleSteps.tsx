import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './SSZMerkleVizData';

export function Step0() {
  const rows = [
    { feat: '오프셋 기반', rlp: 'X', ssz: 'O' },
    { feat: '머클 트리', rlp: 'X', ssz: 'O' },
    { feat: '증명 지원', rlp: 'X', ssz: 'O' },
  ];
  return (<g>
    <text x={210} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">RLP vs SSZ</text>
    {['특성', 'RLP', 'SSZ'].map((h, i) => (
      <text key={h} x={90 + i * 120} y={34} textAnchor="middle"
        fontSize={10} fontWeight={600} fill={i === 2 ? C.why : 'var(--muted-foreground)'}>{h}</text>
    ))}
    {rows.map((r, i) => (
      <motion.g key={r.feat} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        <text x={90} y={52 + i * 17} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{r.feat}</text>
        <text x={210} y={52 + i * 17} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{r.rlp}</text>
        <text x={330} y={52 + i * 17} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.why}>{r.ssz}</text>
      </motion.g>
    ))}
  </g>);
}

export function Step1() {
  const fixed = ['uint64 (8B)', 'bool (1B)', 'Bytes32'];
  const variable = ['List[uint64]', 'Container'];
  return (<g>
    <rect x={20} y={5} width={160} height={90} rx={8} fill="var(--card)" stroke={C.type} strokeWidth={0.6} />
    <text x={100} y={22} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.type}>고정 크기</text>
    {fixed.map((f, i) => (
      <motion.text key={f} x={35} y={40 + i * 16} fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        {f}
      </motion.text>
    ))}
    <rect x={220} y={5} width={170} height={90} rx={8} fill="var(--card)" stroke={C.marshal} strokeWidth={0.6} />
    <text x={305} y={22} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.marshal}>가변 크기</text>
    {variable.map((v, i) => (
      <motion.g key={v} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.3 }}>
        <text x={235} y={42 + i * 18} fontSize={10} fill="var(--muted-foreground)">{v}</text>
        <text x={355} y={42 + i * 18} textAnchor="end" fontSize={10} fill={C.marshal}>4B LE offset</text>
      </motion.g>
    ))}
  </g>);
}

export function Step2() {
  const segs = [
    { label: 'uint64', w: 50, c: C.type },
    { label: 'bool', w: 30, c: C.type },
    { label: 'off=12', w: 45, c: C.marshal },
    { label: 'var data', w: 80, c: C.marshal },
  ];
  let x = 30;
  return (<g>
    <text x={210} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Marshal: 순차 패킹</text>
    {segs.map((s, i) => {
      const sx = x;
      x += s.w + 4;
      return (
        <motion.g key={s.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 + 0.2 }}>
          <rect x={sx} y={28} width={s.w} height={28} rx={4}
            fill={`${s.c}15`} stroke={s.c} strokeWidth={0.8} />
          <text x={sx + s.w / 2} y={46} textAnchor="middle" fontSize={10} fill={s.c}>{s.label}</text>
        </motion.g>
      );
    })}
    <motion.text x={210} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      고정부 인라인 + 가변부 오프셋 기록 후 뒤에 추가
    </motion.text>
  </g>);
}
