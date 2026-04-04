import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import DBLayerViz from './viz/DBLayerViz';
import MmapZeroCopyViz from './viz/MmapZeroCopyViz';
import MVCCSnapshotViz from './viz/MVCCSnapshotViz';
import type { CodeRef } from '@/components/code/types';
import { WHY_MDBX } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DB 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 EL 노드는 블록 헤더, 트랜잭션, 영수증, 계정 상태, 스토리지 등
          수백 GB의 데이터를 저장하고 빠르게 조회해야 한다.
          <br />
          블록 실행 중에는 수천 건의 상태 읽기가 발생하고,
          동시에 RPC 요청도 처리해야 한다.
        </p>
        <p className="leading-7">
          Geth는 LevelDB(LSM-tree, Log-Structured Merge-tree 기반 키-값 저장소)를 사용한다.<br />
          쓰기에 유리하지만, 읽기 시 여러 레벨을 탐색해야 하고
          compaction(백그라운드 레벨 병합)이 읽기 성능을 간섭한다.
          <br />
          블록체인 노드는 읽기 비중이 높으므로 이 트레이드오프가 불리하다.
        </p>
        <p className="leading-7">
          Reth는 MDBX를 선택했다. B+tree 기반으로 모든 읽기가 O(log n)에 완료된다.
          mmap(메모리 매핑)으로 zero-copy 읽기를 제공하고,
          MVCC로 읽기/쓰기가 서로 차단하지 않는다.
          <br />
          추가로, finalized 블록 이전의 데이터를 StaticFiles로 분리하여
          MDBX 크기를 억제하고 B+tree 깊이를 낮게 유지한다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">mmap: zero-copy 읽기</h3>
      <div className="not-prose mb-8"><MmapZeroCopyViz /></div>

      <h3 className="text-lg font-semibold mb-3">MVCC: 읽기/쓰기 동시성</h3>
      <div className="not-prose mb-8"><MVCCSnapshotViz /></div>

      <h3 className="text-lg font-semibold mb-3">왜 MDBX인가?</h3>
      <div className="space-y-2 mb-8">
        {WHY_MDBX.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose mt-6"><DBLayerViz /></div>
    </section>
  );
}
