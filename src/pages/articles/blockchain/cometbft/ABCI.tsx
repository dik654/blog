import { CitationBlock } from '../../../../components/ui/citation';
import ABCIMethodsViz from './viz/ABCIMethodsViz';
import ABCIBlockFlowViz from './viz/ABCIBlockFlowViz';
import {ABCI_METHODS_CODE} from './ABCIData';
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
          <pre className="text-xs overflow-x-auto"><code>{`type RequestFinalizeBlock struct {
    Txs                [][]byte
    DecidedLastCommit  CommitInfo
    Misbehavior        []Misbehavior
    Hash               []byte    // Block hash
    Height             int64
    Time               time.Time
    NextValidatorsHash []byte
    ProposerAddress    []byte
}`}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">ABCI++ FinalizeBlock 요청 구조체. 기존 BeginBlock/DeliverTx/EndBlock을 통합하여 단일 호출로 블록 전체를 처리합니다.</p>
        </CitationBlock>
        {/* ── ABCI 3 Connection Modes ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI 3 Connection Modes — 관심사 분리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CometBFT와 App 사이의 3개 독립 연결
// 각 연결이 다른 목적 + 격리된 state 접근

// 1. Mempool Connection (Async)
//    - CheckTx(tx) → 유효성 검증
//    - 멤풀 진입 전 필터링
//    - state는 read-only (recent committed state)
//    - 비동기 처리 (병렬 가능)

// 2. Consensus Connection (Sync + Ordered)
//    - PrepareProposal / ProcessProposal
//    - FinalizeBlock / Commit
//    - state를 변경하는 유일한 연결
//    - 블록 단위 순차 처리 (ordering 보장)

// 3. Info Connection (Query + Info)
//    - Query(path) → state 조회
//    - Info() → app 메타데이터
//    - RPC handler가 사용
//    - read-only

// 왜 3개 분리?
// 1. Consistency: Consensus만 write, 다른 것은 read
// 2. Performance: CheckTx 병렬, Query 논블록킹
// 3. Isolation: mempool validation이 consensus block 안 됨

// Cosmos SDK의 구현:
// 앱은 각 connection에 다른 multistore view 제공
// - consensusState: 블록 실행용 (writable)
// - checkState: CheckTx용 (read-only copy)
// - queryState: Query용 (committed state)

// 각 Connection의 격리 이유:
// CheckTx가 consensus state 건드리면 → race condition
// Query가 consensus state 건드리면 → inconsistent read
// 분리 설계로 이 문제 원천 차단`}
        </pre>
        <p className="leading-7">
          ABCI는 <strong>3개 독립 connection</strong>.<br />
          Mempool/Consensus/Info 각각 다른 state view 사용.<br />
          관심사 분리로 consistency + performance + isolation 확보.
        </p>

        {/* ── ABCI 2.0 호출 순서 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI 2.0 호출 순서 — 매 블록</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 매 블록 생성/검증 시 호출 순서 (ABCI 2.0+):
//
// Validator가 Proposer인 경우:
// 1. PrepareProposal(txs, ...) → app이 block 내용 결정
//    - txs 선별 (sort, filter, 추가)
//    - max_block_size 고려
//    - app-specific ordering (IBC, module state)
// 2. (consensus 진행: Prevote → Precommit → Commit)
// 3. FinalizeBlock(block) → state transition 실행
// 4. Commit() → state root 반환 + 디스크 저장
//
// Validator가 Proposer 아닌 경우:
// 1. ProcessProposal(block) → 제안된 block 검증
//    - valid면 Accept → Prevote(block)
//    - invalid면 Reject → Prevote(nil)
// 2. (consensus 진행)
// 3. FinalizeBlock(block) → state transition
// 4. Commit() → state root 반환

// 타이밍:
// - PrepareProposal: ~50ms (mempool 선별)
// - ProcessProposal: ~50ms (quick validation)
// - FinalizeBlock: ~수백 ms (full execution)
// - Commit: ~100ms (disk write)

// Cosmos SDK app의 FinalizeBlock 내부:
// 1. BeginBlocker (module 초기화)
// 2. DeliverTx × N (각 tx 실행)
// 3. EndBlocker (module 마무리)
// 4. state root 계산 (IAVL tree)

// → ABCI 2.0에서 단일 호출로 통합 (이전 3회 호출이 1회로)`}
        </pre>
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
