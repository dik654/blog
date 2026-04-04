import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ProcessProposalData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={16} y={15} w={100} h={44} label="BlockExecutor" sub="검증자 노드" color={C.exec} />
    <motion.line x1={120} y1={37} x2={160} y2={37} stroke={C.exec} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <DataBox x={165} y={18} w={140} h={36} label="RequestProcessProposal" sub="Txs, Hash, Height, Time" color={C.exec} />
    </motion.g>
    <motion.line x1={310} y1={37} x2={340} y2={37} stroke={C.app} strokeWidth={1} {...fade(0.4)} />
    <motion.g {...fade(0.5)}>
      <ModuleBox x={345} y={15} w={115} h={44} label="Application" sub="Cosmos SDK" color={C.app} />
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      모든 검증자가 동일한 요청으로 앱 검증 실행
    </text>
  </g>);
}

export function Step1() {
  const layers = [
    { label: 'BlockExecutor', color: C.exec, x: 16 },
    { label: 'AppConnConsensus', color: C.proxy, x: 145 },
    { label: 'localClient', color: C.local, x: 290 },
    { label: 'app', color: C.app, x: 410 },
  ];
  return (<g>
    {layers.map((l, i) => (
      <motion.g key={i} {...fade(i * 0.15)}>
        <ModuleBox x={l.x} y={20} w={i === 1 ? 130 : 100} h={40} label={l.label} sub="" color={l.color} />
        {i < 3 && (
          <motion.line x1={l.x + (i === 1 ? 130 : 100) + 2} y1={40}
            x2={layers[i + 1].x - 2} y2={40}
            stroke={layers[i + 1].color} strokeWidth={1} {...fade(i * 0.15 + 0.1)} />
        )}
      </motion.g>
    ))}
    <motion.text x={240} y={82} textAnchor="middle" fontSize={10} fill={C.local} {...fade(0.6)}>
      Lock() → app.ProcessProposal(ctx, req) → Unlock()
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <ModuleBox x={16} y={15} w={100} h={44} label="app 응답" sub="Status 필드" color={C.app} />
    <motion.g {...fade(0.2)}>
      <ActionBox x={150} y={18} w={130} h={38} label="ACCEPT → prevote" sub="이 블록에 투표" color={C.app} />
    </motion.g>
    <motion.g {...fade(0.4)}>
      <AlertBox x={310} y={18} w={140} h={38} label="REJECT → nil prevote" sub="블록 거부 → 라운드 타임아웃" color={C.reject} />
    </motion.g>
    <text x={240} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      resp.Status == ACCEPT 이면 true 반환 → 합의 투표 진행
    </text>
  </g>);
}
