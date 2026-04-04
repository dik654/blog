export const ROUND_CODE = `Height H, Round R:

1. Propose (리더가 블록 제안)
   ┌─────────────────────────────────────────┐
   │ Proposer = validators[H + R % len(validators)] │
   │ → 라운드 로빈 방식 리더 선출               │
   └─────────────────────────────────────────┘

2. Prevote (검증자가 블록 검증 후 투표)
   ┌─────────────────────────────────────────┐
   │ 유효한 블록 → Prevote(block_hash)        │
   │ 타임아웃/무효 → Prevote(nil)              │
   │ +2/3 Prevote 수집 → "Polka" 달성          │
   └─────────────────────────────────────────┘

3. Precommit (최종 커밋 투표)
   ┌─────────────────────────────────────────┐
   │ Polka 확인 → Precommit(block_hash)       │
   │  → 해당 블록에 "Lock" (이전 Lock 해제)    │
   │ +2/3 nil Prevote → Unlock               │
   │ +2/3 Precommit → 블록 커밋 (최종성!)      │
   │ 실패 시 → Round R+1로 진행                │
   └─────────────────────────────────────────┘

상태 머신:
  NewHeight → (Propose → Prevote → Precommit)+ → Commit → NewHeight
  → 한 Height에서 여러 Round가 진행될 수 있음
  → 타임아웃은 라운드마다 점진적으로 증가

블록 전파: PartSet으로 분할 → LibSwift 기반 Gossip
  → 대형 블록도 파트 단위로 병렬 전파 가능`;

export const STATE_CODE = `// State handles execution of the consensus algorithm.
// It processes votes and proposals, and upon reaching agreement,
// commits blocks to the chain and executes them against the application.
type State struct {
    Height    int64
    Round     int32
    Step      RoundStepType  // NewHeight → Propose → Prevote → Precommit → Commit
    Validators *types.ValidatorSet
    LockedRound int32
    LockedBlock *types.Block
    ValidRound  int32
    ValidBlock  *types.Block
}`;

export const COMPARISON_TABLE = [
  { attr: '최종성', tendermint: '즉시 (1블록)', casper: '~12.8분 (2 에폭)' },
  { attr: '내결함성', tendermint: '1/3 미만 비잔틴', casper: '1/3 미만 비잔틴' },
  { attr: '리더 선출', tendermint: '가중 라운드 로빈', casper: 'RANDAO 기반' },
  { attr: '포크 가능성', tendermint: '없음 (safety 우선)', casper: '있음 (liveness 우선)' },
  { attr: '검증자 수', tendermint: '~150 (실용적 한계)', casper: '~1,000,000+' },
] as const;
