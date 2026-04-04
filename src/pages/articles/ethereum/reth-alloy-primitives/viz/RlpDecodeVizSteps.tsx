import { motion } from 'framer-motion';
import { ActionBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  header: '#6366f1', str: '#10b981', list: '#f59e0b',
  err: '#ef4444', ok: '#8b5cf6', dim: '#94a3b8',
};

export function Step0() {
  return (<g>
    <ActionBox x={30} y={15} w={100} h={34} label="첫 바이트"
      sub="읽기" color={C.header} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={140} y={36} fontSize={12} fill={C.dim}>→ match</text>
      <rect x={190} y={15} width={100} height={26} rx={5}
        fill={`${C.str}10`} stroke={C.str} strokeWidth={0.8} />
      <text x={240} y={32} textAnchor="middle" fontSize={10}
        fill={C.str}>0x00~0x7f</text>
      <rect x={300} y={15} width={100} height={26} rx={5}
        fill={`${C.header}10`} stroke={C.header} strokeWidth={0.8} />
      <text x={350} y={32} textAnchor="middle" fontSize={10}
        fill={C.header}>0x80~0xb7</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={190} y={48} width={100} height={26} rx={5}
        fill={`${C.list}10`} stroke={C.list} strokeWidth={0.8} />
      <text x={240} y={65} textAnchor="middle" fontSize={10}
        fill={C.list}>0xc0~0xf7</text>
      <rect x={300} y={48} width={100} height={26} rx={5}
        fill={`${C.dim}10`} stroke={C.dim} strokeWidth={0.8} />
      <text x={350} y={65} textAnchor="middle" fontSize={10}
        fill={C.dim}>long header</text>
    </motion.g>
    <text x={30} y={100} fontSize={10} fill={C.header}>
      Header.list로 문자열/리스트 구분, payload_length로 크기 결정
    </text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">
      리스트 재귀 디코딩:
    </text>
    <ModuleBox x={30} y={30} w={100} h={34} label="Header"
      sub="list=true" color={C.list} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={140} y={52} fontSize={12} fill={C.dim}>→</text>
      <ActionBox x={155} y={32} w={90} h={30} label="decode()"
        sub="요소 1" color={C.ok} />
      <text x={255} y={52} fontSize={12} fill={C.dim}>→</text>
      <ActionBox x={270} y={32} w={90} h={30} label="decode()"
        sub="요소 2" color={C.ok} />
      <text x={370} y={52} fontSize={10} fill={C.dim}>...</text>
    </motion.g>
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      payload 바이트가 소진될 때까지 재귀 호출
    </motion.text>
  </g>);
}

export function Step2() {
  const errors = [
    { label: 'UnexpectedLength', sub: '길이 불일치' },
    { label: 'LeadingZero', sub: '정수 앞 0x00' },
    { label: 'Overflow', sub: '타입 초과' },
    { label: 'InputTooShort', sub: '버퍼 부족' },
  ];
  return (<g>
    <text x={30} y={18} fontSize={11} fill="var(--muted-foreground)">에러 타입 4가지:</text>
    {errors.map((e, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <AlertBox x={30 + (i % 2) * 200} y={28 + Math.floor(i / 2) * 44}
          w={180} h={36} label={e.label} sub={e.sub} color={C.err} />
      </motion.g>
    ))}
  </g>);
}
