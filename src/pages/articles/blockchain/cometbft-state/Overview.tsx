import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 관리 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT는 합의 진행 상태를 State · BlockStore · EvidencePool 세 계층으로 영구 저장.<br />
          각 계층의 Go 구조체와 저장/조회 경로를 코드 수준으로 추적한다.
        </p>

        {/* ── 3 계층 storage ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3 계층 Storage — 각 계층의 역할</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">state.db (State 저장)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>합의 상태: validator sets, params</li>
              <li>Height별 snapshot</li>
              <li>필수 (crash recovery)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">blockstore.db (Block 저장)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>블록 원본 + meta</li>
              <li>Height → Block 매핑</li>
              <li>Part 단위 저장 (65KB chunks)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">evidence.db (Evidence 저장)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>비잔틴 증거</li>
              <li>만료 후 자동 삭제</li>
              <li>상대적으로 작음</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">State 전이 (Block N 처리)</div>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code className="text-xs">loadState(N-1)</code> → state.db 읽기</li>
              <li><code className="text-xs">executeBlock(state, block)</code></li>
              <li><code className="text-xs">updateState(block, results)</code></li>
              <li><code className="text-xs">saveState(state)</code> → state.db 쓰기</li>
              <li><code className="text-xs">saveBlock(block)</code> → blockstore.db 쓰기</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">분리 설계 이유</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>각 DB가 다른 access pattern</li>
              <li>state — 최신만 활발, 과거는 archive</li>
              <li>blockstore — sequential read-heavy</li>
              <li>evidence — short-lived, write-heavy</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">goleveldb</div>
            <p className="text-sm text-muted-foreground">기본, pure Go (작은 체인)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">cleveldb</div>
            <p className="text-sm text-muted-foreground">C binding, 빠름</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">rocksdb</div>
            <p className="text-sm text-muted-foreground">고성능 (Cosmos Hub)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">boltdb</div>
            <p className="text-sm text-muted-foreground">key-value, simple</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">badgerdb</div>
            <p className="text-sm text-muted-foreground">modern, LSM-tree</p>
          </div>
        </div>
        <p className="leading-7">
          CometBFT는 <strong>3개 독립 DB</strong>로 state 관리.<br />
          State/Block/Evidence 각각 access pattern 맞춤 설계.<br />
          Backend DB 선택 가능 (goleveldb/rocksdb 등).
        </p>
      </div>
    </section>
  );
}
