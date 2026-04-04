import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: PBS 분리 */
export function StepPBS() {
  const actors = [
    { name: 'Searcher', sub: '기회 발견', color: C.mev },
    { name: 'Builder', sub: '블록 빌드', color: C.builder },
    { name: 'Relay', sub: '입찰 검증', color: C.relay },
    { name: 'Proposer', sub: '블록 선택', color: C.ok },
  ];
  return (<g>
    <defs><marker id="mev-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.relay} /></marker></defs>
    {actors.map((a, i) => (
      <motion.g key={a.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <ModuleBox x={5 + i * 105} y={22} w={88} h={42} label={a.name} sub={a.sub} color={a.color} />
        {i < 3 && (
          <motion.line x1={93 + i * 105} y1={43} x2={110 + i * 105} y2={43}
            stroke={C.relay} strokeWidth={0.8} markerEnd="url(#mev-a)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
    <text x={210} y={90} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      경매 방식 — Builder가 MEV 전략을 Proposer에게 노출하지 않음
    </text>
  </g>);
}

/* Step 4: Reth trait 교체 vs Geth sidecar */
export function StepRethVsGeth() {
  return (<g>
    <ModuleBox x={15} y={12} w={185} h={50} label="Reth: trait impl 교체"
      sub="PayloadBuilder → MevPayloadBuilder" color={C.ok} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={220} y={12} width={185} height={50} rx={8} fill="var(--card)" />
      <rect x={220} y={12} width={185} height={50} rx={8}
        fill="transparent" stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
      <text x={312} y={32} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--muted-foreground)">
        Geth: mev-boost
      </text>
      <text x={312} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        별도 sidecar 프로세스
      </text>
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      로컬 fallback 내장 — 외부 실패 시에도 블록 생산 보장
    </motion.text>
  </g>);
}
