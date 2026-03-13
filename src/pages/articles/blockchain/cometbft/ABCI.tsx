import { CitationBlock } from '../../../../components/ui/citation';

export default function ABCI() {
  return (
    <section id="abci" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI (Application BlockChain Interface)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ABCI는 CometBFT와 애플리케이션 사이의 인터페이스로,
          이더리움의 <strong>Engine API</strong>와 유사한 역할을 합니다.
          Engine API가 CL과 EL 사이의 통신을 담당하듯,
          ABCI는 합의 엔진과 상태 머신 사이의 통신을 정의합니다.
        </p>
        <CitationBlock source="CometBFT Documentation" citeKey={3} type="paper" href="https://docs.cometbft.com/v0.38/spec/abci/">
          <p className="italic text-foreground/80">"ABCI allows BFT replication of applications written in any programming language"</p>
          <p className="mt-2 text-xs">ABCI의 핵심 설계 철학: 합의 엔진과 애플리케이션을 분리하여 어떤 프로그래밍 언어로든 블록체인 애플리케이션을 구현할 수 있게 합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI 2.0 주요 메서드</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`// 블록 실행 흐름 (이더리움 Engine API와 비교)

ABCI 메서드                    이더리움 Engine API 대응
─────────────────────────────────────────────────────
PrepareProposal(txs)        ≈  engine_forkchoiceUpdatedV3
 → 애플리케이션이 블록 내용 결정      (payloadAttributes로 빌드 요청)

ProcessProposal(block)      ≈  engine_newPayloadV3
 → 제안된 블록 유효성 검증           (EL이 페이로드 검증)

FinalizeBlock(block)        ≈  engine_forkchoiceUpdatedV3
 → 블록 확정 & 상태 전이 실행        (headBlockHash 업데이트)

Commit()                    ≈  (EL의 state root 커밋)
 → 상태를 디스크에 영구 저장

CheckTx(tx)                 ≈  eth_sendRawTransaction
 → 멤풀 진입 전 트랜잭션 검증        (txpool 유효성 검사)

ExtendVote()                ≈  (해당 없음)
 → 검증자가 투표에 추가 데이터 첨부   (ABCI++ v0.38+ 신규)

VerifyVoteExtension()       ≈  (해당 없음)
 → 다른 검증자의 투표 확장 검증       (오라클, 가격 피드 등 활용)

ABCI++ 진화 (v0.38+):
  레거시:  BeginBlock → DeliverTx × N → EndBlock → Commit
  ABCI++: FinalizeBlock (통합!) → Commit
  → DeliverTx를 개별 호출하던 것을 FinalizeBlock에서 일괄 처리
  → ExtendVote/VerifyVoteExtension으로 투표에 앱 데이터 첨부 가능

4개 동시 ABCI 연결:
  1. Consensus  — PrepareProposal, ProcessProposal, FinalizeBlock
  2. Mempool    — CheckTx (트랜잭션 검증)
  3. Snapshot   — ListSnapshots, OfferSnapshot, ApplySnapshotChunk
  4. Info/Query — 읽기 전용 쿼리 (상태 조회)
  → 이더리움은 Engine API(단일 JSON-RPC)로 CL↔EL 통신`}</code>
        </pre>
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
          <p className="mt-2 text-xs text-muted-foreground">ABCI++ FinalizeBlock 요청 구조체. 기존 BeginBlock/DeliverTx/EndBlock을 통합하여 단일 호출로 블록 전체를 처리합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 실행 순서</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`CometBFT                        Application (Cosmos SDK)
    │                                   │
    │─── PrepareProposal(txs) ────────→│ 트랜잭션 선별/정렬
    │←── 블록 내용 응답 ─────────────────│
    │                                   │
    │─── ProcessProposal(block) ──────→│ 블록 유효성 검증
    │←── Accept / Reject ───────────────│
    │                                   │
    │    [합의: Prevote → Precommit]     │
    │                                   │
    │─── FinalizeBlock(block) ────────→│ 상태 전이 실행
    │←── 결과(events, tx results) ──────│
    │                                   │
    │─── Commit() ───────────────────→│ DB 커밋
    │←── app_hash ──────────────────────│
    │                                   │`}</code>
        </pre>
      </div>
    </section>
  );
}
