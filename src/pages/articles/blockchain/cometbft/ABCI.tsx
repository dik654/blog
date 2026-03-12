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
 → 멤풀 진입 전 트랜잭션 검증        (txpool 유효성 검사)`}</code>
        </pre>
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
