import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './SyncCommitteeVizData';

export function Step0() {
  return (<g>
    <ModuleBox x={25} y={8} w={140} h={38} label="라이트 클라이언트" sub="풀노드 없이 검증" color={C.why} />
    <motion.line x1={170} y1={27} x2={210} y2={27} stroke={C.why} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
      <DataBox x={215} y={15} w={115} h={26} label="512명 서명 확인" color={C.select} />
    </motion.g>
    <motion.text x={210} y={62} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Altair 업그레이드: 싱크 위원회 도입
    </motion.text>
    <motion.text x={210} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
      전체 검증자 서명 검증 대신 512명만으로 충분
    </motion.text>
  </g>);
}

export function Step1() {
  const validators = Array.from({ length: 12 }, (_, i) => i);
  const selected = [2, 5, 7, 10];
  return (<g>
    <text x={210} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.select}>전체 검증자에서 512명 무작위 선정</text>
    {validators.map((v, i) => (
      <motion.g key={v} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.04 + 0.1 }}>
        <rect x={22 + i * 32} y={24} width={26} height={22} rx={4}
          fill={selected.includes(i) ? `${C.select}25` : 'var(--card)'}
          stroke={selected.includes(i) ? C.select : 'var(--border)'}
          strokeWidth={selected.includes(i) ? 1.2 : 0.4} />
        <text x={35 + i * 32} y={39} textAnchor="middle" fontSize={8}
          fill={selected.includes(i) ? C.select : 'var(--muted-foreground)'}>{v}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      256 에폭 (~27시간) 동안 고정
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <ModuleBox x={20} y={8} w={130} h={38} label="SubmitSyncMsg" sub="매 슬롯 호출" color={C.sign} />
    <motion.line x1={155} y1={27} x2={195} y2={27} stroke={C.sign} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
      <ActionBox x={200} y={8} w={140} h={38} label="BLS 서명" sub="DomainSyncCommittee" color={C.sign} />
    </motion.g>
    <motion.text x={210} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      헤드 블록 루트에 BLS 서명 생성
    </motion.text>
  </g>);
}
