export const ABCI_METHODS_CODE = `// 블록 실행 흐름 (이더리움 Engine API와 비교)

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
  → 이더리움은 Engine API(단일 JSON-RPC)로 CL↔EL 통신`;

export const ABCI_METHODS_ANNOTATIONS = [
  { lines: [5, 6] as [number, number], color: 'sky' as const, note: 'PrepareProposal ≈ forkchoiceUpdated' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: 'ProcessProposal ≈ newPayload' },
  { lines: [20, 23] as [number, number], color: 'amber' as const, note: 'ABCI++ 신규 (투표 확장)' },
  { lines: [31, 36] as [number, number], color: 'violet' as const, note: '4개 동시 연결' },
];
