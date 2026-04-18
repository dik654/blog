import { CitationBlock } from '../../../../components/ui/citation';
import ABCIMethodsViz from './viz/ABCIMethodsViz';
import ABCIBlockFlowViz from './viz/ABCIBlockFlowViz';

import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ABCI({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="abci" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI (Application BlockChain Interface)</h2>
      <div className="not-prose mb-8"><ABCIMethodsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ABCI는 CometBFT와 애플리케이션 사이의 인터페이스입니다.
          <br />
          이더리움의 <strong>Engine API</strong>와 유사한 역할을 합니다.
          <br />
          Engine API가 CL과 EL 사이의 통신을 담당하듯, ABCI는 합의 엔진과 상태 머신(State Machine) 사이의 통신을 정의합니다.
        </p>
        <CitationBlock source="CometBFT Documentation" citeKey={3} type="paper" href="https://docs.cometbft.com/v0.38/spec/abci/">
          <p className="italic">"ABCI allows BFT replication of applications written in any programming language"</p>
          <p className="mt-2 text-xs">ABCI의 핵심 설계 철학: 합의 엔진과 애플리케이션을 분리하여 어떤 프로그래밍 언어로든 블록체인 애플리케이션을 구현할 수 있게 합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI 2.0 주요 메서드</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('receive-routine', codeRefs['receive-routine'])} />
          <span className="text-[10px] text-muted-foreground self-center">receiveRoutine()</span>
          <CodeViewButton onClick={() => onCodeRef('handle-msg', codeRefs['handle-msg'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleMsg()</span>
        </div>
        <p>
          // 블록 실행 흐름 (이더리움 Engine API와 비교)<br />
          ABCI 메서드 이더리움 Engine API 대응<br />
          PrepareProposal(txs) ≈ engine_forkchoiceUpdatedV3<br />
          → 애플리케이션이 블록 내용 결정 (payloadAttributes로 빌드 요청)<br />
          ProcessProposal(block) ≈ engine_newPayloadV3<br />
          → 제안된 블록 유효성 검증 (EL이 페이로드 검증)<br />
          FinalizeBlock(block) ≈ engine_forkchoiceUpdatedV3<br />
          → 블록 확정 & 상태 전이 실행 (headBlockHash 업데이트)<br />
          Commit() ≈ (EL의 state root 커밋)<br />
          → 상태를 디스크에 영구 저장<br />
          CheckTx(tx) ≈ eth_sendRawTransaction<br />
          → 멤풀 진입 전 트랜잭션 검증 (txpool 유효성 검사)
        </p>
        <CitationBlock source="cometbft/abci/types/types.go" citeKey={4} type="code" href="https://github.com/cometbft/cometbft/blob/main/abci/types/types.go">
          <div className="text-xs text-foreground/70 space-y-1">
            <p className="font-semibold">ABCI++ <code>RequestFinalizeBlock</code> 구조체</p>
            <p><code>Txs [][]byte</code> — 블록에 포함된 트랜잭션 목록 / <code>DecidedLastCommit CommitInfo</code> — 이전 블록 커밋 정보 / <code>Misbehavior []Misbehavior</code> — 비잔틴 증거 / <code>Hash []byte</code> — 블록 해시 / <code>Height int64</code> — 블록 높이 / <code>NextValidatorsHash []byte</code> — 다음 validator set 해시 / <code>ProposerAddress []byte</code> — 제안자 주소</p>
            <p>기존 <code>BeginBlock</code>/<code>DeliverTx</code>/<code>EndBlock</code>을 통합하여 단일 호출로 블록 전체를 처리</p>
          </div>
        </CitationBlock>
        {/* ── ABCI 3 Connection Modes ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI 3 Connection Modes — 관심사 분리</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">1. Mempool Connection</p>
              <p className="text-xs text-muted-foreground mb-1">Async</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><code>CheckTx(tx)</code> → 유효성 검증</li>
                <li>멤풀 진입 전 필터링</li>
                <li>state는 read-only</li>
                <li>비동기 처리 (병렬 가능)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">2. Consensus Connection</p>
              <p className="text-xs text-muted-foreground mb-1">Sync + Ordered</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><code>PrepareProposal</code> / <code>ProcessProposal</code></li>
                <li><code>FinalizeBlock</code> / <code>Commit</code></li>
                <li>state 변경하는 <strong className="text-foreground">유일한</strong> 연결</li>
                <li>블록 단위 순차 처리</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">3. Info Connection</p>
              <p className="text-xs text-muted-foreground mb-1">Query + Info</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><code>Query(path)</code> → state 조회</li>
                <li><code>Info()</code> → app 메타데이터</li>
                <li>RPC handler가 사용</li>
                <li>read-only</li>
              </ul>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">3개 분리 이유</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Consistency</strong> — Consensus만 write, 나머지 read</p>
                <p><strong className="text-foreground">Performance</strong> — <code>CheckTx</code> 병렬, Query 논블록킹</p>
                <p><strong className="text-foreground">Isolation</strong> — mempool validation이 consensus 차단 안 함</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Cosmos SDK multistore view</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><code>consensusState</code> — 블록 실행용 (writable)</p>
                <p><code>checkState</code> — CheckTx용 (read-only copy)</p>
                <p><code>queryState</code> — Query용 (committed state)</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2"><code>CheckTx</code>가 consensus state 접근 → race condition / <code>Query</code>가 접근 → inconsistent read — 분리로 원천 차단</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          ABCI는 <strong>3개 독립 connection</strong>.<br />
          Mempool/Consensus/Info 각각 다른 state view 사용.<br />
          관심사 분리로 consistency + performance + isolation 확보.
        </p>

        {/* ── ABCI 2.0 호출 순서 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI 2.0 호출 순서 — 매 블록</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Proposer인 경우</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">1.</strong> <code>PrepareProposal(txs)</code> — app이 block 내용 결정 (txs 선별, max_block_size 고려)</p>
                <p><strong className="text-foreground">2.</strong> consensus 진행: Prevote → Precommit → Commit</p>
                <p><strong className="text-foreground">3.</strong> <code>FinalizeBlock(block)</code> — state transition 실행</p>
                <p><strong className="text-foreground">4.</strong> <code>Commit()</code> — state root 반환 + 디스크 저장</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Proposer 아닌 경우</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">1.</strong> <code>ProcessProposal(block)</code> — 제안된 block 검증 (valid → Accept, invalid → Reject)</p>
                <p><strong className="text-foreground">2.</strong> consensus 진행</p>
                <p><strong className="text-foreground">3.</strong> <code>FinalizeBlock(block)</code> — state transition</p>
                <p><strong className="text-foreground">4.</strong> <code>Commit()</code> — state root 반환</p>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">타이밍</p>
              <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <code className="text-xs">PrepareProposal</code><span>~50ms (mempool 선별)</span>
                <code className="text-xs">ProcessProposal</code><span>~50ms (quick validation)</span>
                <code className="text-xs">FinalizeBlock</code><span>~수백ms (full execution)</span>
                <code className="text-xs">Commit</code><span>~100ms (disk write)</span>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>FinalizeBlock</code> 내부 (Cosmos SDK)</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>1. <code>BeginBlocker</code> — module 초기화</p>
                <p>2. <code>DeliverTx</code> x N — 각 tx 실행</p>
                <p>3. <code>EndBlocker</code> — module 마무리</p>
                <p>4. state root 계산 (IAVL tree)</p>
                <p className="text-xs mt-2">ABCI 2.0에서 기존 3회 호출 → 단일 호출로 통합</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          매 블록에 ABCI <strong>3-4개 함수 순차 호출</strong>.<br />
          PrepareProposal(proposer만) → ProcessProposal → FinalizeBlock → Commit.<br />
          ABCI 2.0에서 기존 4 메서드를 FinalizeBlock 하나로 통합.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록 실행 순서</h3>
      </div>
      <div className="not-prose mb-8"><ABCIBlockFlowViz /></div>
    </section>
  );
}
