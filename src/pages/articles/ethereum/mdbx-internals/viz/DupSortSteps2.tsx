import { motion } from 'framer-motion';
import { C } from './DupSortVizData';

export function Step3() {
  const slots = ['slot_00', 'slot_01', 'slot_02'];
  return (
    <g>
      <text x={20} y={22} fontSize={10} fontWeight={600}
        fill={C.key}>Address → Storage Slots</text>
      {/* Address key */}
      <rect x={20} y={36} width={100} height={30} rx={4}
        fill={`${C.key}12`} stroke={C.key} strokeWidth={1} />
      <text x={70} y={55} textAnchor="middle" fontSize={9}
        fontFamily="monospace" fill={C.key}>0xa1b2..c3</text>
      {/* Arrow */}
      <line x1={120} y1={51} x2={148} y2={51}
        stroke={C.sub} strokeWidth={1} />
      <polygon points="146,47 153,51 146,55" fill={C.sub} />
      {/* Storage slots */}
      <rect x={158} y={30} width={180} height={110} rx={5}
        fill={`${C.val}06`} stroke={C.val} strokeWidth={0.8} />
      <text x={248} y={48} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.val}>StorageSlots (DupSort)</text>
      {slots.map((s, i) => (
        <motion.g key={s} initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.12 }}>
          <rect x={170} y={58 + i * 26} width={70} height={20}
            rx={3} fill={`${C.sub}12`} stroke={C.sub}
            strokeWidth={0.5} />
          <text x={205} y={72 + i * 26} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fill={C.sub}>
            {s}
          </text>
          <rect x={248} y={58 + i * 26} width={78} height={20}
            rx={3} fill={`${C.val}10`} stroke={C.val}
            strokeWidth={0.4} />
          <text x={287} y={72 + i * 26} textAnchor="middle"
            fontSize={8} fill={C.val}>value_{i}</text>
        </motion.g>
      ))}
      <text x={190} y={152} fontSize={9} fill={C.dim}>
        주소별 storage 순회 / 범위 조회 최적
      </text>
    </g>
  );
}

export function Step4() {
  const ops = [
    { name: 'seek_dup', desc: '특정 value 위치로 이동' },
    { name: 'next_dup', desc: '같은 key의 다음 value' },
    { name: 'prev_dup', desc: '같은 key의 이전 value' },
  ];
  return (
    <g>
      <text x={20} y={22} fontSize={10} fontWeight={600}
        fill={C.cursor}>DupSort 커서 연산</text>
      {/* Values */}
      {['v0', 'v1', 'v2', 'v3'].map((v, i) => (
        <rect key={v} x={30 + i * 60} y={40} width={50} height={24}
          rx={4} fill={`${C.val}12`} stroke={C.val}
          strokeWidth={0.6} />
      ))}
      {['v0', 'v1', 'v2', 'v3'].map((v, i) => (
        <text key={`t-${v}`} x={55 + i * 60} y={56}
          textAnchor="middle" fontSize={9} fill={C.val}>{v}</text>
      ))}
      {/* Cursor pointer */}
      <motion.g animate={{ x: [0, 60, 120] }}
        transition={{ duration: 2, repeat: Infinity,
          repeatType: 'reverse' }}>
        <polygon points="50,70 56,78 44,78" fill={C.cursor} />
        <text x={50} y={90} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.cursor}>cursor</text>
      </motion.g>
      {/* Operations list */}
      {ops.map((op, i) => (
        <motion.g key={op.name} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.15 }}>
          <rect x={30} y={105 + i * 24} width={90} height={18}
            rx={3} fill={`${C.cursor}10`} stroke={C.cursor}
            strokeWidth={0.6} />
          <text x={75} y={118 + i * 24} textAnchor="middle"
            fontSize={9} fontFamily="monospace" fill={C.cursor}>
            {op.name}
          </text>
          <text x={135} y={118 + i * 24} fontSize={9}
            fill={C.dim}>{op.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}
