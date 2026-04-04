import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: tokio + SessionManager */
export function StepTokio() {
  return (<g>
    <ModuleBox x={130} y={18} w={160} h={50} label="SessionManager"
      sub="tokio 비동기 이벤트 루프" color={C.ok} />
    {['active', 'pending', 'events'].map((l, i) => (
      <motion.g key={l} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + i * 0.1 }}>
        <rect x={40 + i * 120} y={80} width={90} height={22} rx={11}
          fill={`${C.ok}12`} stroke={C.ok} strokeWidth={0.7} />
        <text x={85 + i * 120} y={94} textAnchor="middle" fontSize={10} fill={C.ok}>{l}</text>
      </motion.g>
    ))}
    <text x={210} y={118} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      mpsc 채널로 SessionEvent 중앙 수신
    </text>
  </g>);
}

/* Step 4: 4계층 네트워크 스택 */
export function StepLayers() {
  const layers = [
    { label: 'Discovery', color: '#6b7280' },
    { label: 'TCP', color: C.net },
    { label: 'RLPx', color: C.enc },
    { label: 'eth-wire', color: C.ok },
  ];
  return (<g>
    {layers.map((l, i) => (
      <motion.g key={l.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={60} y={10 + i * 26} width={110} height={20} rx={4}
          fill={`${l.color}12`} stroke={l.color} strokeWidth={1} />
        <text x={115} y={24 + i * 26} textAnchor="middle" fontSize={11} fontWeight={600} fill={l.color}>
          {l.label}
        </text>
        {i < 3 && <line x1={115} y1={30 + i * 26} x2={115} y2={36 + i * 26}
          stroke={l.color} strokeWidth={0.8} opacity={0.4} />}
      </motion.g>
    ))}
    <motion.text x={300} y={45} fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      각 계층이 독립적으로
    </motion.text>
    <motion.text x={300} y={60} fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      파이프라인 처리
    </motion.text>
  </g>);
}
