import { motion } from 'framer-motion';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 상태 조회 요구 */
export function Step0() {
  const reqs = ['StateByRoot', 'StateBySlot', 'ForkChoice'];
  return (<g>
    {reqs.map((r, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={20} y={18 + i * 28} width={100} height={20} rx={10}
          fill={`${C.hot}12`} stroke={C.hot} strokeWidth={0.8} />
        <text x={70} y={32 + i * 28} textAnchor="middle" fontSize={11} fill={C.hot}>{r}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={170} y={25} w={120} h={42} label="즉시 응답" sub="지연 = 합의 장애" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 1: 메모리 vs 지연 */
export function Step1() {
  return (<g>
    <AlertBox x={30} y={25} w={140} h={45} label="전부 메모리" sub="OOM 위험" color={C.err} />
    <motion.text x={198} y={52} fontSize={12} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      vs
    </motion.text>
    <AlertBox x={230} y={25} w={140} h={45} label="매번 DB 읽기" sub="응답 지연" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      수백 MB 상태를 매번 역직렬화하는 비용도 큼
    </motion.text>
  </g>);
}

/* Step 2: 빈 슬롯 문제 — 에폭 경계(32의 배수)만 저장 */
export function Step2() {
  const slots = [0, 4, 8, 12, 16, 20, 28, 32];
  return (<g>
    {slots.map((s, i) => {
      const isEpoch = s % 32 === 0;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.06 }}>
          <rect x={15 + i * 50} y={25} width={40} height={30} rx={4}
            fill={isEpoch ? `${C.ok}18` : 'var(--card)'}
            stroke={isEpoch ? C.ok : 'var(--border)'} strokeWidth={isEpoch ? 1 : 0.5} />
          <text x={35 + i * 50} y={38} textAnchor="middle" fontSize={8}
            fill="var(--muted-foreground)">slot {s}</text>
          <text x={35 + i * 50} y={50} textAnchor="middle" fontSize={10} fontWeight={isEpoch ? 600 : 400}
            fill={isEpoch ? C.ok : 'var(--muted-foreground)'}>
            {isEpoch ? '저장' : '없음'}
          </text>
        </motion.g>
      );
    })}
    <motion.text x={210} y={80} textAnchor="middle" fontSize={10} fill={C.replay}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      에폭 경계(32의 배수)만 상태 저장 → 빈 슬롯은 Replay 필요
    </motion.text>
  </g>);
}

