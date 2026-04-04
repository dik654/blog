import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { app: '#ec4899', iavl: '#8b5cf6', block: '#f59e0b', db: '#10b981' };

const STEPS = [
  { label: 'App State 계층', body: 'Cosmos SDK 모듈이 TX를 실행하여 상태를 변경합니다.' },
  { label: 'IAVL Tree 계층', body: '상태 변경이 IAVL 머클 트리에 저장됩니다.' },
  { label: 'BlockStore 계층', body: '블록과 커밋을 파트 단위로 저장합니다.' },
  { label: 'DB Backend 계층', body: '실제 디스크 I/O를 처리합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.app}>keeper.SetState() — 비즈니스 로직</text>
    <text x={20} y={44} fontSize={10} fill={C.app}>Line 1: store := ctx.KVStore(k.storeKey)  // 모듈 전용 스토어</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.app}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: bz := k.cdc.MustMarshal(&state)  // Protobuf 직렬화
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: store.Set(key, bz)  // IAVL 트리에 쓰기 (아직 미커밋)
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.iavl}>iavl.MutableTree.Set() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.iavl}>Line 1: tree.set(key, value)  // 밸런싱 + 삽입</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.iavl}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: orphans := tree.prepareOrphans(version)  // 이전 노드 보존
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: rootHash := tree.SaveVersion()  // AppHash = 루트 해시
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={100} h={22} label="rootHash" sub="= AppHash" color={C.iavl} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.block}>blockStore.SaveBlock() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.block}>Line 1: parts := block.MakePartSet(BlockPartSizeBytes)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: for i := 0; i {'<'} parts.Total(); i++ {'{'} savePart(i) {'}'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: bs.db.Set(calcBlockCommitKey(h), commitBytes)  // 커밋 저장
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.db}>DB Backend 선택</text>
    <text x={20} y={44} fontSize={10} fill={C.db}>Line 1: case "goleveldb": db = goleveldb.NewDB(name, dir)  // 기본</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.db}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: case "pebbledb": db = pebble.NewDB(name, dir)  // 고성능
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.db}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: case "rocksdb": db = rocksdb.NewDB(name, dir)  // 대규모
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // 배치 쓰기 + LRU 캐시로 디스크 I/O 최소화
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function StateLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
