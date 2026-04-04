export const C = { val: '#8b5cf6', ok: '#10b981', hi: '#f59e0b' };

export const STEPS = [
  {
    label: 'Validator + ValidatorSet 구조체',
    body: 'Validator: Address, PubKey, VotingPower, ProposerPriority',
  },
  {
    label: 'incrementProposerPriority() — 1단계: 가산',
    body: '모든 검증자의 ProposerPriority += VotingPower',
  },
  {
    label: 'incrementProposerPriority() — 2단계: 선택 + 감산',
    body: 'findProposer(): 가장 높은 priority 검증자 선택',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'validator-struct', 1: 'proposer-priority', 2: 'proposer-priority',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'validator.go — Validator + ValidatorSet struct',
  1: 'validator.go — priority += VotingPower',
  2: 'validator.go — findProposer() + priority -= TotalVP',
};
