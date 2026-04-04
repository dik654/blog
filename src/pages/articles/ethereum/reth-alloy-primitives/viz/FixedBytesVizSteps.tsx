import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  fixed: '#8b5cf6', addr: '#6366f1', b256: '#10b981',
  deref: '#f59e0b', copy: '#0ea5e9', dim: '#94a3b8',
};

export function Step0() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">FixedBytes&lt;N&gt; 메모리 레이아웃:</text>
    <rect x={30} y={30} width={340} height={32} rx={6}
      fill={`${C.fixed}10`} stroke={C.fixed} strokeWidth={1} />
    <text x={200} y={50} textAnchor="middle" fontSize={11} fontFamily="monospace"
      fill={C.fixed}>[u8; N] — 스택에 인라인 배치</text>
    <text x={30} y={82} fontSize={10} fill={C.dim}>#[repr(transparent)] — 내부 배열과 동일한 메모리</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <text x={30} y={100} fontSize={10} fontWeight={600} fill={C.fixed}>
        N은 컴파일 타임 상수 — 런타임 크기 결정 비용 = 0
      </text>
    </motion.g>
  </g>);
}

export function Step1() {
  const chain = ['FixedBytes<N>', '&[u8; N]', '&[u8]'];
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">Deref → AsRef 위임 체인:</text>
    {chain.map((t, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.2 }}>
        <rect x={30 + i * 130} y={35} width={110} height={30} rx={6}
          fill={`${C.deref}12`} stroke={C.deref} strokeWidth={0.8} />
        <text x={85 + i * 130} y={54} textAnchor="middle" fontSize={11}
          fontFamily="monospace" fill={C.deref}>{t}</text>
        {i < 2 && <text x={140 + i * 130} y={54} fontSize={14} fill={C.dim}>→</text>}
      </motion.g>
    ))}
    <motion.text x={30} y={88} fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      len(), iter(), contains() 등 슬라이스 메서드를 직접 호출 가능
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <ModuleBox x={140} y={10} w={160} h={32} label="FixedBytes<20>"
      sub="20바이트 내부 배열" color={C.fixed} />
    <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}>
      <rect x={120} y={52} width={200} height={36} rx={8}
        fill={`${C.addr}10`} stroke={C.addr} strokeWidth={1.2} />
      <text x={220} y={74} textAnchor="middle" fontSize={12}
        fontWeight={700} fill={C.addr}>Address</text>
    </motion.g>
    <motion.text x={220} y={106} textAnchor="middle" fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      뉴타입 래퍼 — B256과 혼용 시 컴파일 에러
    </motion.text>
  </g>);
}

export function Step3() {
  return (<g>
    <ModuleBox x={140} y={10} w={160} h={32} label="FixedBytes<32>"
      sub="32바이트 내부 배열" color={C.fixed} />
    <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}>
      <rect x={130} y={52} width={180} height={36} rx={8}
        fill={`${C.b256}10`} stroke={C.b256} strokeWidth={1.2} />
      <text x={220} y={74} textAnchor="middle" fontSize={12}
        fontWeight={700} fill={C.b256}>B256</text>
    </motion.g>
    <motion.text x={220} y={106} textAnchor="middle" fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      블록 해시, TX 해시, 상태 루트에 사용
    </motion.text>
  </g>);
}

export function Step4() {
  const traits = ['Copy', 'Eq', 'Hash', 'Ord'];
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">#[derive] 자동 구현:</text>
    {traits.map((t, i) => (
      <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={30 + i * 95} y={35} w={80} h={28} label={t} color={C.copy} />
      </motion.g>
    ))}
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill={C.copy}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      모든 trait이 FixedBytes&lt;N&gt;에서 한 번 구현 → Address, B256이 자동 상속
    </motion.text>
  </g>);
}
