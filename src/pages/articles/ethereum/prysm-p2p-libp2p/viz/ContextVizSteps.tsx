import { motion } from 'framer-motion';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: CL 노드의 네트워크 요구 */
export function Step0() {
  const msgs = ['Block', 'Attestation', 'SyncComm'];
  return (<g>
    {msgs.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={20} y={20 + i * 30} width={80} height={22} rx={11}
          fill={`${C.net}12`} stroke={C.net} strokeWidth={0.8} />
        <text x={60} y={35 + i * 30} textAnchor="middle" fontSize={11} fill={C.net}>{m}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={150} y={25} w={110} h={42} label="수만 CL 노드" sub="12초 안에 전파" color={C.ok} />
    </motion.g>
    <motion.circle r={3} fill={C.net}
      initial={{ cx: 100, cy: 50, opacity: 1 }}
      animate={{ cx: 148, cy: 46, opacity: 0 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }} />
    <AlertBox x={300} y={30} w={100} h={36} label="devp2p" sub="pub/sub 미지원" color={C.err} />
  </g>);
}

/* Step 1: 악의적 피어 + 메시지 폭주 */
export function Step1() {
  return (<g>
    {Array.from({ length: 5 }, (_, i) => (
      <motion.circle key={i} cx={60 + i * 40} cy={45} r={12}
        fill="var(--card)" stroke={i < 2 ? C.err : C.ok} strokeWidth={1}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }} />
    ))}
    {Array.from({ length: 5 }, (_, i) => (
      <text key={`t${i}`} x={60 + i * 40} y={49} textAnchor="middle"
        fontSize={10} fill={i < 2 ? C.err : C.ok}>{i < 2 ? '악성' : `P${i}`}</text>
    ))}
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      스팸 전파 + 대역폭 폭발
    </motion.text>
    <motion.text x={210} y={105} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      피어 품질 관리 없이는 네트워크 마비
    </motion.text>
  </g>);
}

/* Step 2: Eclipse 공격 — 공격자가 모든 피어 슬롯을 점유 */
export function Step2() {
  const attackers = [
    { x: 35, y: 35 }, { x: 85, y: 55 }, { x: 310, y: 35 }, { x: 365, y: 55 },
  ];
  return (<g>
    {/* 공격자 → 피해 노드 간선 */}
    {attackers.map((a, i) => (
      <motion.line key={`l${i}`} x1={a.x} y1={a.y} x2={160 + (i < 2 ? 0 : 100)} y2={50}
        stroke={C.err} strokeWidth={0.6} strokeDasharray="3 2" opacity={0.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: i * 0.08 + 0.2, duration: 0.3 }} />
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={160} y={25} width={100} height={50} rx={8} fill="var(--card)"
        stroke={C.err} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={210} y={46} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.err}>
        피해 노드
      </text>
      <text x={210} y={60} textAnchor="middle" fontSize={8} fill={C.err}>모든 슬롯 점유</text>
    </motion.g>
    {attackers.map((a, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 + 0.3 }}>
        <circle cx={a.x} cy={a.y} r={10} fill={`${C.err}15`} stroke={C.err} strokeWidth={0.8} />
        <text x={a.x} y={a.y + 3.5} textAnchor="middle" fontSize={7} fill={C.err}>공격</text>
      </motion.g>
    ))}
    <motion.text x={210} y={100} textAnchor="middle" fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      정상 피어 연결 불가 → Discv5 다양성 + ConnGater로 방어
    </motion.text>
  </g>);
}

