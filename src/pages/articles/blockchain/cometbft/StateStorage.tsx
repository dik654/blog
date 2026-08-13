import CodePanel from "@/components/ui/code-panel";
import { CitationBlock } from "../../../../components/ui/citation";
import StateLayerViz from "./viz/StateLayerViz";
import {
  STATE_STRUCT_CODE,
  STATE_STRUCT_ANNOTATIONS,
  BLOCKSTORE_CODE,
  BLOCKSTORE_ANNOTATIONS,
  DB_BACKEND_TABLE,
} from "./StateStorageData";
import type { CodeRef } from "@/components/code/types";

const CELL = "border border-border px-4 py-2";

export default function StateStorage({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="state-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 & 저장소</h2>
      <div className="not-prose mb-8">
        <StateLayerViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 상태 관리는 두 개의 핵심 컴포넌트로 나누어 볼 수 있습니다.
          <strong>State 구조체</strong>(합의 상태)와 <strong>BlockStore</strong>
          (블록 저장소)입니다. State는 validator set을 Next·Current·Last 세대로
          관리해 update가 적용되는 시점을 추적하고,
          BlockStore는 블록을 파트 단위로 분할 저장하고 LRU(Least Recently Used)
          캐시로 조회를 최적화합니다.
        </p>
        <CitationBlock
          source="cometbft/state/state.go"
          citeKey={9}
          type="code"
          href="https://github.com/cometbft/cometbft/blob/main/state/state.go"
        >
          <p className="text-xs text-foreground/70">
            State 전이: 블록 수신 → 상태 복사 → ABCI 실행 → 상태 업데이트. 이전
            상태는 불변(immutable) 유지 — copy-on-write 방식으로 롤백 안전성
            보장
          </p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">State 구조체</h3>
        <CodePanel
          title="합의 상태: 밸리데이터 + 파라미터 + 해시"
          code={STATE_STRUCT_CODE}
          annotations={STATE_STRUCT_ANNOTATIONS}
        />
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockStore 구조</h3>
        <CodePanel
          title="블록 저장소: LRU 캐시 + 키 레이아웃"
          code={BLOCKSTORE_CODE}
          annotations={BLOCKSTORE_ANNOTATIONS}
        />
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
              {DB_BACKEND_TABLE.map((r) => (
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
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Pruning 전략 — 디스크 관리
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                1. blockstore.db
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>블록 원본 저장</p>
                <p>증가율: block byte와 block interval로 실측</p>
                <p>Pruning: RPC·replay 요구 범위와 함께 결정</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                2. state.db
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>validator sets, params, heights</p>
                <p>증가율: validator·parameter update에 의존</p>
                <p>Pruning: commit 검증과 복구 history 고려</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                3. app.db
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Cosmos SDK KV store (IAVL tree)</p>
                <p>증가율: application state model에 의존</p>
                <p>Pruning: query·snapshot 정책과 함께 결정</p>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                Pruning 설정 (config.toml)
              </p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <code className="text-xs">"nothing"</code>
                <span>모든 history 유지 (archive node)</span>
                <code className="text-xs">"everything"</code>
                <span>필요 최소만 (lightest)</span>
                <code className="text-xs">"default"</code>
                <span>일반 (최근 heights 유지)</span>
                <code className="text-xs">"custom"</code>
                <span>사용자 정의</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <code>pruning_keep_recent=100</code> /{" "}
                <code>pruning_interval=10</code>
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                용량 계획 체크리스트
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>blockstore: height당 block·commit byte 증가율</p>
                <p>state DB: validator·consensus parameter update 빈도</p>
                <p>application DB: state model·snapshot·pruning 정책</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                같은 chain도 release, indexer, snapshot과 보존 기간에 따라 실제
                디스크 사용량이 달라집니다.
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          운영 관점에서는 blockstore와 consensus state, application state가 서로
          다른 책임과 보존 정책을 갖는다. 일반 validator는 필요한 조회·복구
          범위를 남기면서 pruning을 적용할 수 있고, historical query를 제공하는
          archive 구성은 더 긴 보존 기간과 별도 용량 계획이 필요하다.
        </p>
      </div>
    </section>
  );
}
