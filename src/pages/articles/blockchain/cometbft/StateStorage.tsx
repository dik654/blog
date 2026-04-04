import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import StateLayerViz from './viz/StateLayerViz';
import { STATE_STRUCT_CODE, STATE_STRUCT_ANNOTATIONS, BLOCKSTORE_CODE, BLOCKSTORE_ANNOTATIONS, DB_BACKEND_TABLE } from './StateStorageData';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function StateStorage({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 & 저장소</h2>
      <div className="not-prose mb-8"><StateLayerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 상태 관리는 2개의 핵심 컴포넌트로 구성됩니다.
          <br />
          <strong>State 구조체</strong>(합의 상태)와 <strong>BlockStore</strong>(블록 저장소)입니다.
          <br />
          State는 밸리데이터 세트를 3세대(Next/Current/Last)로 관리합니다.
          <br />
          BlockStore는 블록을 파트 단위로 분할 저장하고 LRU(Least Recently Used) 캐시로 조회를 최적화합니다.
        </p>
        <CitationBlock source="cometbft/state/state.go" citeKey={9} type="code" href="https://github.com/cometbft/cometbft/blob/main/state/state.go">
          <pre className="text-xs overflow-x-auto"><code>{`// State 전이: 블록 수신 → 상태 복사 → ABCI 실행 → 상태 업데이트
// 이전 상태는 불변(immutable) 유지 — 롤백 안전성 보장`}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">상태는 복사 후 변경(copy-on-write) 방식으로 관리됩니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">State 구조체</h3>
        <CodePanel title="합의 상태: 밸리데이터 + 파라미터 + 해시" code={STATE_STRUCT_CODE} annotations={STATE_STRUCT_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockStore 구조</h3>
        <CodePanel title="블록 저장소: LRU 캐시 + 키 레이아웃" code={BLOCKSTORE_CODE} annotations={BLOCKSTORE_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">DB 백엔드 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>백엔드</th>
                <th className={`${CELL} text-left`}>설명</th>
                <th className={`${CELL} text-left`}>특성</th>
              </tr>
            </thead>
            <tbody>
              {DB_BACKEND_TABLE.map(r => (
                <tr key={r.backend}>
                  <td className={`${CELL} font-mono text-xs`}>{r.backend}</td>
                  <td className={CELL}>{r.desc}</td>
                  <td className={CELL}>{r.perf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
