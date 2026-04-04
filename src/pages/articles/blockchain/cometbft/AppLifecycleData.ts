export const LIFECYCLE_CODE = `블록 생명주기 (ABCI++ v0.38+)

1. InitChain (체인 초기화)
   → 제네시스 상태 설정: ChainID, 밸리데이터, 파라미터

2. PrepareProposal (블록 구성)
   → 제안자가 멤풀에서 TX 선택 + 순서 결정
   → 앱이 TX 추가/제거/재정렬 가능

3. ProcessProposal (블록 검증)
   → 제안된 블록의 유효성을 앱이 검증
   → ACCEPT/REJECT 반환

4. ExtendVote + VerifyVoteExtension
   → 투표에 앱 데이터 첨부 (오라클 가격 등)
   → 다른 밸리데이터의 확장 데이터 검증

5. FinalizeBlock (블록 확정)
   → TX 실행, 상태 전이, 결과 반환
   → 레거시 BeginBlock+DeliverTx+EndBlock 통합

6. Commit (상태 영구 저장)
   → AppHash 반환 → 다음 블록 헤더에 포함
   → RetainHeight로 이전 블록 정리 가능`;

export const LIFECYCLE_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'violet' as const, note: '초기화' },
  { lines: [6, 8] as [number, number], color: 'sky' as const, note: '블록 구성' },
  { lines: [14, 16] as [number, number], color: 'emerald' as const, note: 'Vote Extension (ABCI++)' },
  { lines: [18, 20] as [number, number], color: 'amber' as const, note: '핵심: FinalizeBlock' },
];

export const LEGACY_VS_ABCIPP = `ABCI 진화: 레거시 → ABCI++

레거시 (v0.34):
  BeginBlock(header)
  → DeliverTx(tx1) → DeliverTx(tx2) → ... → DeliverTx(txN)
  → EndBlock(height)
  → Commit()

ABCI++ (v0.38+):
  PrepareProposal(txs)     ← 신규: 앱이 블록 구성 제어
  ProcessProposal(block)   ← 신규: 앱이 블록 검증
  ExtendVote(vote)         ← 신규: 투표 확장
  FinalizeBlock(block)     ← BeginBlock+DeliverTx+EndBlock 통합
  Commit()`;

export const LEGACY_ANNOTATIONS = [
  { lines: [3, 7] as [number, number], color: 'rose' as const, note: '레거시: 개별 TX 호출' },
  { lines: [9, 14] as [number, number], color: 'emerald' as const, note: 'ABCI++: 통합 + 신규 메서드' },
];
