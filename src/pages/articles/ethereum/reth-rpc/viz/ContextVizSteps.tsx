import { motion } from 'framer-motion';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 외부 통신 */
export function StepExternal() {
  const clients = ['Wallet', 'DApp', 'CL'];
  return (<g>
    {clients.map((c, i) => (
      <motion.g key={c} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={20 + i * 100} y={25} width={70} height={28} rx={14}
          fill={`${C.rpc}12`} stroke={C.rpc} strokeWidth={0.8} />
        <text x={55 + i * 100} y={43} textAnchor="middle" fontSize={11} fill={C.rpc}>{c}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={135} y={72} w={150} h={36} label="JSON-RPC"
        sub="표준 API 인터페이스" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 1: 라우팅 문제 */
export function StepRouting() {
  const ns = ['eth_*', 'net_*', 'debug_*', 'engine_*'];
  return (<g>
    {ns.map((n, i) => (
      <motion.g key={n} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={20} y={15 + i * 25} width={80} height={20} rx={10}
          fill={`${C.rpc}10`} stroke={C.rpc} strokeWidth={0.7} />
        <text x={60} y={29 + i * 25} textAnchor="middle" fontSize={11} fill={C.rpc}>{n}</text>
      </motion.g>
    ))}
    <motion.text x={160} y={55} fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      → 각각 다른 핸들러로 라우팅
    </motion.text>
    <AlertBox x={250} y={40} w={140} h={36} label="타입 불일치" sub="런타임 에러 위험" color={C.err} />
  </g>);
}

/* Step 2: Engine API + 보안 */
export function StepSecurity() {
  return (<g>
    <ActionBox x={40} y={20} w={130} h={40} label="Engine API" sub="CL ↔ EL 통신" color={C.engine} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={200} y={20} width={100} height={40} rx={6}
        fill={`${C.mw}08`} stroke={C.mw} strokeWidth={1} strokeDasharray="4 3" />
      <text x={250} y={38} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.mw}>JWT 인증</text>
      <text x={250} y={52} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">포트 8551</text>
    </motion.g>
    <AlertBox x={100} y={78} w={200} h={32} label="Rate Limiting" sub="악의적 클라이언트 방어" color={C.err} />
  </g>);
}
