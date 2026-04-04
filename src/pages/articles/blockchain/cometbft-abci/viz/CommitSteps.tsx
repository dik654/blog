import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './CommitData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  const layers = [
    { label: 'BlockExecutor', color: C.exec, x: 16, w: 100 },
    { label: 'AppConnConsensus', color: C.proxy, x: 140, w: 130 },
    { label: 'localClient', color: C.local, x: 295, w: 90 },
    { label: 'app.Commit', color: C.app, x: 410, w: 55 },
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
      app.Commit() → MultiStore 디스크 커밋 → RetainHeight 반환
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <DataBox x={16} y={18} w={120} h={36} label="RetainHeight" sub="보관할 최소 높이" color={C.app} />
    <motion.line x1={140} y1={36} x2={175} y2={36} stroke={C.exec} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <ActionBox x={180} y={18} w={120} h={38} label="pruneBlocks()" sub="오래된 블록 삭제" color={C.exec} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <DataBox x={325} y={18} w={130} h={36} label="디스크 공간 절약" sub="앱이 보관 기간 결정" color={C.exec} />
    </motion.g>
    <text x={240} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      RetainHeight 이전 블록 데이터 삭제 — 풀 노드 디스크 관리
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <ActionBox x={16} y={18} w={120} h={38} label="mempool.Update" sub="TX 정리" color={C.mem} />
    <motion.line x1={140} y1={37} x2={175} y2={37} stroke={C.mem} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <DataBox x={180} y={18} w={120} h={36} label="block.Txs 제거" sub="이미 실행된 TX" color={C.mem} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <DataBox x={325} y={18} w={120} h={36} label="TxResults 확인" sub="실패 TX도 제거" color={C.app} />
    </motion.g>
    <text x={240} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      블록에 포함된 TX를 mempool에서 제거 — 중복 실행 방지
    </text>
  </g>);
}

export function Step3() {
  return (<g>
    <ActionBox x={16} y={12} w={100} h={38} label="① app.Commit" sub="앱 상태 저장" color={C.app} />
    <motion.line x1={120} y1={31} x2={155} y2={31} stroke={C.store} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <ActionBox x={160} y={12} w={100} h={38} label="② store.Save" sub="CometBFT 상태" color={C.store} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <AlertBox x={290} y={8} w={170} h={45} label="순서 중요!" sub="역순 → 크래시 시 불일치" color="#ef4444" />
    </motion.g>
    <motion.text x={240} y={80} textAnchor="middle" fontSize={10} fill={C.store} {...fade(0.6)}>
      app 먼저 → CometBFT 나중 — 크래시 복구 시 안전
    </motion.text>
  </g>);
}
