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
          <p className="text-xs text-foreground/70">State 전이: 블록 수신 → 상태 복사 → ABCI 실행 → 상태 업데이트. 이전 상태는 불변(immutable) 유지 — copy-on-write 방식으로 롤백 안전성 보장</p>
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

        {/* ── Pruning 전략 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pruning 전략 — 디스크 관리</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">1. blockstore.db</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>블록 원본 저장</p>
                <p>크기: 연간 ~100GB (Cosmos Hub)</p>
                <p>Pruning: 가장 공격적 가능 (재생 가능)</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">2. state.db</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>validator sets, params, heights</p>
                <p>크기: 작음 (~수 GB)</p>
                <p>Pruning: 중간 (validator set history 필요)</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">3. app.db</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Cosmos SDK KV store (IAVL tree)</p>
                <p>크기: 가장 큼 (연간 ~500GB+)</p>
                <p>Pruning: 가장 보수적</p>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Pruning 설정 (config.toml)</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <code className="text-xs">"nothing"</code><span>모든 history 유지 (archive node)</span>
                <code className="text-xs">"everything"</code><span>필요 최소만 (lightest)</span>
                <code className="text-xs">"default"</code><span>일반 (최근 heights 유지)</span>
                <code className="text-xs">"custom"</code><span>사용자 정의</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2"><code>pruning_keep_recent=100</code> / <code>pruning_interval=10</code></p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">메인넷 예시 — Cosmos Hub (~2TB)</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>blockstore.db: <strong className="text-foreground">1.5TB</strong> (archive)</p>
                <p>state.db: <strong className="text-foreground">100GB</strong></p>
                <p>app.db (IAVL): <strong className="text-foreground">400GB</strong> (최근 100K heights)</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Pruning: 매 10 blocks 체크 → retained_height = current - 100 → 이전 데이터 삭제</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          CometBFT는 <strong>3개 독립 DB</strong> (blockstore/state/app).<br />
          각각 pruning 정책 설정 가능 → 디스크 운영 유연.<br />
          validator는 pruning 활성, archive는 전체 유지.
        </p>
      </div>
    </section>
  );
}
