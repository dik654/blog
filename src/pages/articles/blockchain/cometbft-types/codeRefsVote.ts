import type { CodeRef } from '@/components/code/types';
import voteGo from './codebase/cometbft/types/vote.go?raw';
import validatorGo from './codebase/cometbft/types/validator.go?raw';

export const voteRefs: Record<string, CodeRef> = {
  'vote-struct': {
    path: 'types/vote.go', code: voteGo, lang: 'go', highlight: [10, 22],
    desc: 'Vote struct — 서명된 투표 메시지',
    annotations: [
      { lines: [12, 12], color: 'sky', note: 'Type: Prevote(1) / Precommit(2)' },
      { lines: [13, 15], color: 'emerald', note: 'Height + Round + BlockID: 투표 대상 식별' },
      { lines: [18, 19], color: 'amber', note: 'Signature + Extension: Ed25519 서명' },
    ],
  },
  'voteset-struct': {
    path: 'types/vote.go', code: voteGo, lang: 'go', highlight: [24, 40],
    desc: 'VoteSet — height/round별 투표 수집 컨테이너',
    annotations: [
      { lines: [27, 30], color: 'sky', note: 'chainID + height + round + type: 투표 범위 식별' },
      { lines: [34, 36], color: 'emerald', note: 'votes 배열 + sum: 투표력 집계' },
      { lines: [37, 38], color: 'amber', note: 'maj23 + votesByBlock: 2/3+ 판정 구조' },
    ],
  },
  'addvote': {
    path: 'types/vote.go', code: voteGo, lang: 'go', highlight: [42, 97],
    desc: 'AddVote() → addVote() — 서명 검증 → 집계 → 2/3+ 판정',
    annotations: [
      { lines: [58, 65], color: 'sky', note: 'height/round/type 일치 확인' },
      { lines: [73, 77], color: 'emerald', note: 'PubKey.VerifySignature()로 Ed25519 서명 검증' },
      { lines: [80, 82], color: 'amber', note: 'votes[idx] = vote, sum += VotingPower' },
      { lines: [92, 95], color: 'violet', note: 'sum > TotalVP*2/3 → maj23 설정' },
    ],
  },
  'validator-struct': {
    path: 'types/validator.go', code: validatorGo, lang: 'go', highlight: [10, 24],
    desc: 'Validator + ValidatorSet 구조체',
    annotations: [
      { lines: [11, 16], color: 'sky', note: 'Validator: Address, PubKey, VotingPower, ProposerPriority' },
      { lines: [19, 24], color: 'emerald', note: 'ValidatorSet: Validators 배열 + Proposer + totalVotingPower' },
    ],
  },
  'proposer-priority': {
    path: 'types/validator.go', code: validatorGo, lang: 'go', highlight: [53, 88],
    desc: 'IncrementProposerPriority() — 가중 라운드 로빈',
    annotations: [
      { lines: [69, 72], color: 'sky', note: 'times만큼 반복 → incrementProposerPriority()' },
      { lines: [76, 78], color: 'emerald', note: '모든 검증자: priority += VotingPower' },
      { lines: [81, 82], color: 'amber', note: 'findProposer(): 가장 높은 priority 선택' },
      { lines: [85, 85], color: 'violet', note: '선택된 제안자: priority -= TotalVotingPower' },
    ],
  },
};
