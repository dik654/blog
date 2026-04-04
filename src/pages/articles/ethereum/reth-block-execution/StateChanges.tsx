import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import StateChangesViz from './viz/StateChangesViz';
import { BUNDLE_FIELDS } from './StateChangesData';
import type { CodeRef } from '@/components/code/types';

export default function StateChanges({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeField, setActiveField] = useState(0);

  return (
    <section id="state-changes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 변경 & Bundle</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>BundleState</code>는 블록 실행 결과의 컨테이너다.
          revm이 TX를 실행할 때마다 변경된 계정 잔액, 스토리지 슬롯, 배포된 컨트랙트 코드를 이 구조체에 누적한다.
          <br />
          DB에 즉시 쓰지 않고 인메모리 HashMap에 보관하는 것이 핵심이다.
        </p>
        <p className="leading-7">
          <strong>reverts 필드가 reorg를 지원한다.</strong> 각 블록의 "이전 상태"를 기록해 둔다.<br />
          예를 들어 계정 A의 잔액이 10 ETH에서 8 ETH로 변경되면,
          reverts에 "계정 A: 10 ETH"를 저장한다.
          <br />
          reorg 발생 시 reverts를 역순으로 적용하면 원래 상태로 복원된다.
        </p>
        <p className="leading-7">
          <code>write_to_storage()</code>가 최종적으로 DB에 기록한다.<br />
          AccountChangeSet, StorageChangeSet 테이블에 변경 이력을 남기고,
          최신 상태를 PlainAccountState, PlainStorageState 테이블에 덮어쓴다.
          <br />
          MerkleStage가 이 변경분을 읽어 상태 루트를 계산한다.
        </p>
      </div>

      <div className="not-prose mb-6"><StateChangesViz /></div>

      {/* BundleState field cards */}
      <h3 className="text-lg font-semibold mb-3">BundleState 구조</h3>
      <div className="not-prose space-y-2 mb-6">
        {BUNDLE_FIELDS.map((f, i) => (
          <motion.div key={i} onClick={() => setActiveField(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeField ? 'border-sky-500/50 bg-sky-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeField ? 1 : 0.6 }}>
            <div className="flex items-baseline gap-3">
              <span className={`font-mono font-bold text-sm ${i === activeField ? 'text-sky-500' : 'text-foreground/70'}`}>{f.field}</span>
              <span className="text-xs text-foreground/40 font-mono">{f.type_str}</span>
            </div>
            {i === activeField && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-foreground/70 leading-relaxed mt-2">{f.desc}</motion.p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('block-executor', codeRefs['block-executor'])} />
        <span className="text-[10px] text-muted-foreground self-center">BundleState 구조체</span>
      </div>
    </section>
  );
}
