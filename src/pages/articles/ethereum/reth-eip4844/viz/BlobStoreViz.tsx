import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './BlobStoreVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BlobStore trait — 인터페이스
    </text>
    <text x={20} y={42} fontSize={10} fill={C.track}>
      Line 1: trait BlobStore {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.track}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:     fn insert(tx, sidecar)  // 삽입
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.track}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3:     fn get(tx_hash) -&gt; Option&lt;Sidecar&gt;
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.track}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 4:     fn delete(tx) / fn cleanup()
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.track}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 5: {'}'}  // DiskFile(프로덕션) | InMemory(테스트)
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      DiskFileBlobStore::insert() 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.disk}>
      Line 1: let encoded = sidecar.encode()  // RLP 인코딩
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.cache}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: self.lookup.insert(tx_hash, blob_hash)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.cache}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: self.lru_cache.put(tx_hash, encoded.clone())
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.disk}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: fs::write(blob_dir / tx_hash_hex, encoded)?
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      DiskFileBlobStore::get() 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.cache}>
      Line 1: if let Some(data) = self.lru_cache.get(hash) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.cache}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     return Ok(Some(decode(data)))  // 캐시 히트
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.cache}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.disk}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: let data = fs::read(blob_dir / hash)?  // 디스크 읽기
    </motion.text>
    <motion.text x={20} y={108} fontSize={10} fill={C.cache}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 5: self.lru_cache.put(hash, data.clone())  // 캐시 추가
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      지연 삭제 — delete() + cleanup()
    </text>
    <text x={20} y={42} fontSize={10} fill={C.cache}>
      Line 1: fn delete(tx) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.cache}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:     self.txs_to_delete.push(tx)  // 목록에 추가만
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.cache}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
      Line 3: {'}'}
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.disk}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 4: fn cleanup() {'{'} // 백그라운드 일괄 실행
    </motion.text>
    <motion.text x={40} y={108} fontSize={10} fill={C.disk}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
      Line 5:     for tx in txs_to_delete {'{'} fs::remove_file(tx)? {'}'}
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function BlobStoreViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
