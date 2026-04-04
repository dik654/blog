export const C = { type: '#6366f1', err: '#ef4444', ok: '#10b981', vote: '#f59e0b', val: '#8b5cf6' };

export const STEPS = [
  {
    label: '합의 엔진의 모든 메시지는 타입 안전한 Go 구조체',
    body: 'Block, Vote, ValidatorSet, Evidence',
  },
  {
    label: 'Block = Header + Data + Evidence + LastCommit',
    body: 'Header: 14개 필드 (ChainID, Height, 6개 해시 등)',
  },
  {
    label: 'Vote = 검증자의 서명된 투표',
    body: 'Type(Prevote/Precommit) + Height + Round + BlockID',
  },
  {
    label: 'ValidatorSet = 가중 라운드 로빈 추첨',
    body: '모든 검증자: priority += VotingPower',
  },
  {
    label: 'Evidence = 비잔틴 행위 증거',
    body: 'DuplicateVoteEvidence: 같은 H/R에서 이중 투표',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'block-struct', 1: 'header-struct',
  2: 'vote-struct', 3: 'proposer-priority', 4: 'evidence-struct',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'block.go — Block struct',
  1: 'block.go — Header struct',
  2: 'vote.go — Vote struct',
  3: 'validator.go — IncrementProposerPriority()',
  4: 'evidence.go — DuplicateVoteEvidence',
};
