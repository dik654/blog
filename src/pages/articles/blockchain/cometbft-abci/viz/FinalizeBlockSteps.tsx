import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';
import { C } from './FinalizeBlockData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={16} y={15} w={100} h={44} label="BlockExecutor" sub="ApplyBlock" color={C.exec} />
    <motion.line x1={120} y1={37} x2={160} y2={37} stroke={C.mem} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <ActionBox x={165} y={18} w={100} h={38} label="mempool.Lock" sub="TX 유입 차단" color={C.mem} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <DataBox x={290} y={18} w={140} h={38} label="defer mempool.Unlock" sub="블록 실행 후 자동 해제" color={C.mem} />
    </motion.g>
    <text x={240} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      블록 실행 중 mempool 변경 방지 — 상태 일관성 보장
    </text>
  </g>);
}

export function Step1() {
  const layers = [
    { label: 'BlockExecutor', color: C.exec, x: 16, w: 100 },
    { label: 'AppConnConsensus', color: C.proxy, x: 140, w: 130 },
    { label: 'localClient', color: C.local, x: 295, w: 90 },
    { label: 'app', color: C.app, x: 410, w: 55 },
  ];
  return (<g>
    {layers.map((l, i) => (
      <motion.g key={i} {...fade(i * 0.12)}>
        <ModuleBox x={l.x} y={20} w={l.w} h={40} label={l.label} sub="" color={l.color} />
        {i < 3 && (
          <motion.line x1={l.x + l.w + 2} y1={40}
            x2={layers[i + 1].x - 2} y2={40}
            stroke={layers[i + 1].color} strokeWidth={1} {...fade(i * 0.12 + 0.08)} />
        )}
      </motion.g>
    ))}
    <motion.text x={240} y={82} textAnchor="middle" fontSize={10} fill={C.app} {...fade(0.5)}>
      BeginBlock + DeliverTx×N + EndBlock → FinalizeBlock 단일 호출
    </motion.text>
  </g>);
}

export function Step2() {
  const fields = [
    { label: 'TxResults', sub: '각 TX 결과', color: C.app },
    { label: 'ValidatorUpdates', sub: '검증자 변경', color: C.exec },
    { label: 'AppHash', sub: '머클 루트', color: C.local },
  ];
  return (<g>
    <ModuleBox x={16} y={15} w={90} h={40} label="앱 응답" sub="FinalizeBlock" color={C.app} />
    {fields.map((f, i) => (
      <motion.g key={i} {...fade(0.2 + i * 0.15)}>
        <DataBox x={125 + i * 115} y={18} w={105} h={34} label={f.label} sub={f.sub} color={f.color} />
      </motion.g>
    ))}
    <text x={240} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      ResponseFinalizeBlock — 앱이 블록 실행 결과를 합의 엔진에 반환
    </text>
  </g>);
}

export function Step3() {
  return (<g>
    <ActionBox x={16} y={20} w={120} h={38} label="updateState()" sub="상태 갱신 함수" color={C.exec} />
    <motion.line x1={140} y1={39} x2={175} y2={39} stroke={C.exec} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <StatusBox x={180} y={12} w={130} h={52} label="Validators 업데이트" sub="다음 블록부터 적용" color={C.app} progress={0.7} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <StatusBox x={330} y={12} w={130} h={52} label="ConsensusParams" sub="블록 크기, 가스 제한" color={C.exec} progress={1} />
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      앱 응답의 변경 사항을 CometBFT 합의 상태에 반영
    </text>
  </g>);
}
