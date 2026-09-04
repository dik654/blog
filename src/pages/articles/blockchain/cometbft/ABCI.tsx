import { CitationBlock } from "../../../../components/ui/citation";
import ABCIMethodsViz from "./viz/ABCIMethodsViz";
import ABCIBlockFlowViz from "./viz/ABCIBlockFlowViz";

import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

const ENGINE_COMPARISON = [
  ["PrepareProposal", "block에 넣을 transaction을 application이 선별", "forkchoiceUpdated + payload attributes로 build 요청"],
  ["ProcessProposal", "제안된 block을 application rule로 검증", "newPayload로 execution payload 검증"],
  ["FinalizeBlock", "결정된 block의 transaction을 실행하고 state transition 계산", "forkchoiceUpdated로 canonical head 반영"],
  ["Commit", "state를 영구 저장하고 app hash 반환", "execution state root를 database에 반영"],
  ["CheckTx", "mempool 진입 전 application-level 검증", "sendRawTransaction 이후 txpool validation"],
] as const;

export default function ABCI({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="abci" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ABCI: 합의 엔진과 application state machine을 분리하는 경계
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ABCI(Application BlockChain Interface)는 CometBFT가 block의 순서와 finality를 결정하는 일과 application이
          transaction을 실행해 state를 바꾸는 일을 분리합니다. 이 경계 덕분에 CometBFT는 account, contract, fee 같은 domain rule을 몰라도
          됩니다. application 쪽은 P2P와 BFT voting을 직접 구현하지 않아도 됩니다.
        </p>
        <p>
          Ethereum의 Engine API도 consensus layer와 execution layer를 연결한다는 점에서는 비슷합니다. 다만 호출 의미까지 같지는 않습니다. 아래
          대응은 두 architecture를 처음 읽을 때 책임의 위치를 비교하려고 놓은 guide입니다. method를 일대일로 치환하는 표로 읽으면 안 됩니다.
        </p>
        <CitationBlock
          source="CometBFT Documentation"
          citeKey={3}
          type="paper"
          href="https://docs.cometbft.com/v0.38/spec/abci/"
        >
          <p className="italic">
            "ABCI allows BFT replication of applications written in any
            programming language"
          </p>
          <p className="mt-2 text-xs">
            ABCI의 핵심 설계 철학: 합의 엔진과 애플리케이션을 분리하여 어떤
            프로그래밍 언어로든 블록체인 애플리케이션을 구현할 수 있게 합니다.
          </p>
        </CitationBlock>
      </div>
      <div className="not-prose my-8">
        <ABCIMethodsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ABCI 2.0 주요 메서드
        </h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("receive-routine", codeRefs["receive-routine"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            receiveRoutine()
          </span>
          <CodeViewButton
            onClick={() => onCodeRef("handle-msg", codeRefs["handle-msg"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            handleMsg()
          </span>
        </div>
      </div>
      <div data-viz="abci-engine-api-comparison" className="not-prose my-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-muted/20 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Responsibility map</p>
          <h3 className="mt-2 text-lg font-bold">ABCI와 Engine API는 같은 함수가 아니라 비슷한 경계를 제공합니다</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground"><tr><th className="px-4 py-3">ABCI method</th><th className="px-4 py-3">CometBFT에서의 책임</th><th className="px-4 py-3">Ethereum에서 가까운 책임</th></tr></thead>
            <tbody>
              {ENGINE_COMPARISON.map(([method, comet, ethereum]) => (
                <tr key={method} className="border-t"><th className="px-4 py-3"><code>{method}</code></th><td className="px-4 py-3 text-muted-foreground">{comet}</td><td className="px-4 py-3 text-muted-foreground">{ethereum}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock
          source="cometbft/abci/types/types.go"
          citeKey={4}
          type="code"
          href="https://github.com/cometbft/cometbft/blob/main/abci/types/types.go"
        >
          <div className="text-xs text-foreground/70 space-y-1">
            <p className="font-semibold">
              ABCI++ <code>RequestFinalizeBlock</code> 구조체
            </p>
            <p>
              <code>Txs [][]byte</code> — 블록에 포함된 트랜잭션 목록 /{" "}
              <code>DecidedLastCommit CommitInfo</code> — 이전 블록 커밋 정보 /{" "}
              <code>Misbehavior []Misbehavior</code> — 비잔틴 증거 /{" "}
              <code>Hash []byte</code> — 블록 해시 / <code>Height int64</code> —
              블록 높이 / <code>NextValidatorsHash []byte</code> — 다음
              validator set 해시 / <code>ProposerAddress []byte</code> — 제안자
              주소
            </p>
            <p>
              기존 <code>BeginBlock</code>/<code>DeliverTx</code>/
              <code>EndBlock</code>을 통합하여 단일 호출로 블록 전체를 처리
            </p>
          </div>
        </CitationBlock>
        {/* ── ABCI 3 Connection Modes ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ABCI 3 Connection Modes — 관심사 분리
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                1. Mempool Connection
              </p>
              <p className="text-xs text-muted-foreground mb-1">Async</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  <code>CheckTx(tx)</code> → 유효성 검증
                </li>
                <li>멤풀 진입 전 필터링</li>
                <li>state는 read-only</li>
                <li>비동기 처리 (병렬 가능)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                2. Consensus Connection
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                Sync + Ordered
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  <code>PrepareProposal</code> / <code>ProcessProposal</code>
                </li>
                <li>
                  <code>FinalizeBlock</code> / <code>Commit</code>
                </li>
                <li>
                  state 변경하는{" "}
                  <strong className="text-foreground">유일한</strong> 연결
                </li>
                <li>블록 단위 순차 처리</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                3. Info Connection
              </p>
              <p className="text-xs text-muted-foreground mb-1">Query + Info</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  <code>Query(path)</code> → state 조회
                </li>
                <li>
                  <code>Info()</code> → app 메타데이터
                </li>
                <li>RPC handler가 사용</li>
                <li>read-only</li>
              </ul>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                3개 분리 이유
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Consistency</strong> —
                  Consensus만 write, 나머지 read
                </p>
                <p>
                  <strong className="text-foreground">Performance</strong> —{" "}
                  <code>CheckTx</code> 병렬, Query 논블록킹
                </p>
                <p>
                  <strong className="text-foreground">Isolation</strong> —
                  mempool validation이 consensus 차단 안 함
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                Cosmos SDK multistore view
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <code>consensusState</code> — 블록 실행용 (writable)
                </p>
                <p>
                  <code>checkState</code> — CheckTx용 (read-only copy)
                </p>
                <p>
                  <code>queryState</code> — Query용 (committed state)
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <code>CheckTx</code>가 consensus state 접근 → race condition /{" "}
                <code>Query</code>가 접근 → inconsistent read. State view를 분리해
                이 경로를 구조적으로 줄인다.
              </p>
            </div>
          </div>
        </div>
        <p>
          세 connection을 분리하면 consensus write와 speculative validation, committed-state query가 서로 다른 state view를 사용할 수 있습니다. 그 결과 느린 query나 대량의 <code>CheckTx</code>가 block execution의 순서를 바꾸지 않으면서도, read workload는 가능한 범위에서 병렬로 처리할 수 있습니다.
        </p>

        {/* ── ABCI 2.0 호출 순서 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ABCI 2.0 호출 순서 — 매 블록
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                Proposer인 경우
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">1.</strong>{" "}
                  <code>PrepareProposal(txs)</code> — app이 block 내용 결정 (txs
                  선별, max_block_size 고려)
                </p>
                <p>
                  <strong className="text-foreground">2.</strong> consensus
                  진행: Prevote → Precommit → Commit
                </p>
                <p>
                  <strong className="text-foreground">3.</strong>{" "}
                  <code>FinalizeBlock(block)</code> — state transition 실행
                </p>
                <p>
                  <strong className="text-foreground">4.</strong>{" "}
                  <code>Commit()</code> — state root 반환 + 디스크 저장
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                Proposer 아닌 경우
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">1.</strong>{" "}
                  <code>ProcessProposal(block)</code> — 제안된 block 검증 (valid
                  → Accept, invalid → Reject)
                </p>
                <p>
                  <strong className="text-foreground">2.</strong> consensus 진행
                </p>
                <p>
                  <strong className="text-foreground">3.</strong>{" "}
                  <code>FinalizeBlock(block)</code> — state transition
                </p>
                <p>
                  <strong className="text-foreground">4.</strong>{" "}
                  <code>Commit()</code> — state root 반환
                </p>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                지연을 나누어 보는 기준
              </p>
              <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <code className="text-xs">PrepareProposal</code>
                <span>후보 선택·정렬</span>
                <code className="text-xs">ProcessProposal</code>
                <span>제안 검증</span>
                <code className="text-xs">FinalizeBlock</code>
                <span>transaction·module 실행</span>
                <code className="text-xs">Commit</code>
                <span>storage flush</span>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                <code>FinalizeBlock</code> 내부 (Cosmos SDK)
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  1. <code>BeginBlocker</code> — module 초기화
                </p>
                <p>
                  2. <code>DeliverTx</code> x N — 각 tx 실행
                </p>
                <p>
                  3. <code>EndBlocker</code> — module 마무리
                </p>
                <p>4. state root 계산 (IAVL tree)</p>
                <p className="text-xs mt-2">
                  ABCI 2.0에서 기존 3회 호출 → 단일 호출로 통합
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          매 block에서 proposer는 먼저 <code>PrepareProposal</code>로 내용을 구성하고, validator는 <code>ProcessProposal</code>로 이를 검증합니다. Consensus가 block을 결정한 뒤에는 모든 노드가 <code>FinalizeBlock</code>으로 같은 state transition을 실행하고 <code>Commit</code>으로 결과를 저장합니다. ABCI 2.0은 과거의 <code>BeginBlock</code>·<code>DeliverTx</code>·<code>EndBlock</code> 호출을 <code>FinalizeBlock</code>으로 묶어 이 결정 경계를 더 분명하게 만들었습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록 실행 순서</h3>
      </div>
      <div className="not-prose mb-8">
        <ABCIBlockFlowViz />
      </div>
    </section>
  );
}
